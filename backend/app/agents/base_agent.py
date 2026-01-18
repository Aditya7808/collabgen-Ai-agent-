"""
Base Agent class and shared agent utilities.
Provides the foundation for all specialized agents.
"""
import asyncio
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, Optional
import time

from app.services.llm_service import get_llm_service, LLMService
from app.utils.exceptions import AgentExecutionError
from app.utils.logging import get_logger

logger = get_logger(__name__)


class BaseAgent(ABC):
    """
    Abstract base class for all CollabGen agents.
    Provides common functionality and enforces contract.
    """
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.llm_service: LLMService = get_llm_service()
        self._execution_start: Optional[float] = None
        self._last_execution_time_ms: float = 0
    
    @property
    def execution_time_ms(self) -> float:
        """Get the last execution time in milliseconds."""
        return self._last_execution_time_ms
    
    @abstractmethod
    def get_system_prompt(self) -> str:
        """Get the system prompt for this agent."""
        pass
    
    @abstractmethod
    async def build_prompt(self, **kwargs) -> str:
        """Build the prompt for this agent based on inputs."""
        pass
    
    @abstractmethod
    def validate_output(self, content: str) -> bool:
        """Validate the generated output meets requirements."""
        pass
    
    async def execute(self, **kwargs) -> str:
        """
        Execute the agent and return generated content.
        
        Returns:
            Generated markdown content
            
        Raises:
            AgentExecutionError: If execution fails
        """
        self._execution_start = time.time()
        
        try:
            logger.info(
                f"Agent execution started",
                agent_name=self.name,
                inputs=list(kwargs.keys()),
            )
            
            # Build the prompt
            prompt = await self.build_prompt(**kwargs)
            
            # Get system prompt
            system_prompt = self.get_system_prompt()
            
            # Generate content
            content = await self.llm_service.generate_content(
                prompt=prompt,
                system_instruction=system_prompt,
                temperature=0.7,
            )
            
            # Validate output
            if not self.validate_output(content):
                logger.warning(
                    "Agent output validation failed",
                    agent_name=self.name,
                    content_length=len(content),
                )
                # Still return content but log warning
            
            self._last_execution_time_ms = (time.time() - self._execution_start) * 1000
            
            logger.info(
                "Agent execution completed",
                agent_name=self.name,
                execution_time_ms=self._last_execution_time_ms,
                content_length=len(content),
            )
            
            return content
            
        except Exception as e:
            self._last_execution_time_ms = (time.time() - self._execution_start) * 1000
            logger.error(
                "Agent execution failed",
                agent_name=self.name,
                error=str(e),
                error_type=type(e).__name__,
            )
            raise AgentExecutionError(
                message=f"Agent '{self.name}' execution failed: {str(e)}",
                agent_name=self.name,
                details={"error_type": type(e).__name__},
            )
    
    def format_markdown_section(self, title: str, content: str) -> str:
        """Format a section with proper markdown."""
        return f"## {title}\n\n{content}\n\n"
