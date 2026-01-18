"""
LLM Service for OpenAI GPT-4 API integration.
Implements retry logic and error handling.
"""
import asyncio
from typing import Any, Dict, List, Optional
from openai import AsyncOpenAI
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)

from app.config import get_settings
from app.utils.exceptions import LLMAPIError, TimeoutError
from app.utils.logging import get_logger

logger = get_logger(__name__)


class LLMService:
    """Service for interacting with OpenAI GPT-4 LLM."""
    
    def __init__(self):
        self.settings = get_settings()
        self.client = AsyncOpenAI(api_key=self.settings.OPENAI_API_KEY)
        self.model = self.settings.OPENAI_MODEL
        self._total_tokens_used = 0
        self._failure_count = 0
        self._max_failures = self.settings.CIRCUIT_BREAKER_FAILURE_THRESHOLD
    
    @property
    def tokens_used(self) -> int:
        """Get total tokens used in this session."""
        return self._total_tokens_used
    
    def reset_token_count(self) -> None:
        """Reset the token counter."""
        self._total_tokens_used = 0
    
    @property
    def is_circuit_open(self) -> bool:
        """Check if circuit breaker is open (too many failures)."""
        return self._failure_count >= self._max_failures
    
    def _record_success(self) -> None:
        """Record a successful API call."""
        self._failure_count = 0
    
    def _record_failure(self) -> None:
        """Record a failed API call."""
        self._failure_count += 1
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=30),
        retry=retry_if_exception_type((ConnectionError, asyncio.TimeoutError)),
        reraise=True,
    )
    async def generate_content(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        max_output_tokens: int = 4096,
    ) -> str:
        """
        Generate content using OpenAI GPT-4 API with retry logic.
        
        Args:
            prompt: The user prompt
            system_instruction: Optional system instruction
            temperature: Creativity parameter (0.0-2.0)
            max_output_tokens: Maximum tokens in response
            
        Returns:
            Generated text content
            
        Raises:
            LLMAPIError: If API call fails after retries
            TimeoutError: If request times out
        """
        try:
            # Check circuit breaker state
            if self.is_circuit_open:
                logger.warning("Circuit breaker is open, returning fallback")
                raise LLMAPIError(
                    message="LLM service temporarily unavailable (circuit breaker open)",
                    provider="OpenAI",
                    details={"state": "circuit_breaker_open"}
                )
            
            # Build messages
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            
            # Make the API call with timeout
            logger.info(
                "Calling OpenAI API",
                model=self.model,
                prompt_length=len(prompt),
                temperature=temperature,
            )
            
            response = await asyncio.wait_for(
                self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_output_tokens,
                ),
                timeout=self.settings.TIMEOUT_LLM_REQUEST,
            )
            
            # Check for valid response
            if not response or not response.choices:
                raise LLMAPIError(
                    message="Empty response from OpenAI API",
                    provider="OpenAI",
                )
            
            content = response.choices[0].message.content
            
            if not content:
                raise LLMAPIError(
                    message="Empty content in OpenAI response",
                    provider="OpenAI",
                )
            
            # Track token usage
            if response.usage:
                self._total_tokens_used += response.usage.total_tokens
            
            logger.info(
                "OpenAI API call successful",
                model=self.model,
                response_length=len(content),
                total_tokens=self._total_tokens_used,
                prompt_tokens=response.usage.prompt_tokens if response.usage else 0,
                completion_tokens=response.usage.completion_tokens if response.usage else 0,
            )
            
            # Record success
            self._record_success()
            
            return content
            
        except asyncio.TimeoutError:
            self._record_failure()
            raise TimeoutError(
                message="LLM API request timed out",
                operation="generate_content",
                timeout_seconds=self.settings.TIMEOUT_LLM_REQUEST,
            )
        except Exception as e:
            self._record_failure()
            logger.error(
                "OpenAI API error",
                error=str(e),
                error_type=type(e).__name__,
            )
            if isinstance(e, (LLMAPIError, TimeoutError)):
                raise
            raise LLMAPIError(
                message=f"OpenAI API error: {str(e)}",
                provider="OpenAI",
                details={"original_error": str(e)},
            )
    
    async def generate_with_messages(
        self,
        messages: List[Dict[str, str]],
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
    ) -> str:
        """
        Generate content from a list of messages (chat format).
        
        Args:
            messages: List of {"role": "user"|"assistant", "content": "..."}
            system_instruction: Optional system instruction
            temperature: Creativity parameter
            
        Returns:
            Generated response text
        """
        # Build OpenAI message format
        openai_messages = []
        
        if system_instruction:
            openai_messages.append({"role": "system", "content": system_instruction})
        
        for msg in messages:
            role = msg["role"]
            if role == "assistant":
                role = "assistant"
            elif role == "user":
                role = "user"
            openai_messages.append({"role": role, "content": msg["content"]})
        
        try:
            response = await asyncio.wait_for(
                self.client.chat.completions.create(
                    model=self.model,
                    messages=openai_messages,
                    temperature=temperature,
                ),
                timeout=self.settings.TIMEOUT_LLM_REQUEST,
            )
            
            if response.usage:
                self._total_tokens_used += response.usage.total_tokens
            
            return response.choices[0].message.content or ""
            
        except asyncio.TimeoutError:
            raise TimeoutError(
                message="LLM API request timed out",
                operation="generate_with_messages",
                timeout_seconds=self.settings.TIMEOUT_LLM_REQUEST,
            )
        except Exception as e:
            raise LLMAPIError(
                message=f"OpenAI API error: {str(e)}",
                provider="OpenAI",
            )
    
    async def health_check(self) -> bool:
        """
        Check if the LLM API is accessible.
        
        Returns:
            True if healthy, False otherwise
        """
        try:
            response = await asyncio.wait_for(
                self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": "Hello"}],
                    max_tokens=5,
                ),
                timeout=10,
            )
            return bool(response and response.choices)
        except Exception as e:
            logger.warning("LLM health check failed", error=str(e))
            return False


# Singleton instance
_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    """Get the LLM service singleton."""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
