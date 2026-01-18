"""
Custom exception hierarchy for CollabGen-Agent.
Provides structured error handling with HTTP status mapping.
"""
from typing import Any, Dict, Optional


class CollabGenException(Exception):
    """Base exception for all CollabGen-Agent errors."""
    
    def __init__(
        self,
        message: str,
        details: Optional[Dict[str, Any]] = None,
        status_code: int = 500
    ):
        self.message = message
        self.details = details or {}
        self.status_code = status_code
        super().__init__(self.message)


class AgentExecutionError(CollabGenException):
    """Raised when an agent fails to execute properly."""
    
    def __init__(self, message: str, agent_name: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            details={"agent_name": agent_name, **(details or {})},
            status_code=500
        )
        self.agent_name = agent_name


class LLMAPIError(CollabGenException):
    """Raised when LLM provider API fails."""
    
    def __init__(self, message: str, provider: str = "Gemini", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            details={"provider": provider, **(details or {})},
            status_code=503
        )
        self.provider = provider


class ValidationError(CollabGenException):
    """Raised when input validation fails."""
    
    def __init__(self, message: str, field: Optional[str] = None, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            details={"field": field, **(details or {})} if field else details,
            status_code=400
        )
        self.field = field


class ReportNotFoundError(CollabGenException):
    """Raised when a report cannot be found."""
    
    def __init__(self, report_id: str):
        super().__init__(
            message=f"Report with ID '{report_id}' not found",
            details={"report_id": report_id},
            status_code=404
        )
        self.report_id = report_id


class StorageError(CollabGenException):
    """Raised when file/storage operations fail."""
    
    def __init__(self, message: str, operation: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            details={"operation": operation, **(details or {})},
            status_code=500
        )
        self.operation = operation


class RateLimitError(CollabGenException):
    """Raised when rate limit is exceeded."""
    
    def __init__(self, message: str = "Rate limit exceeded", retry_after: Optional[int] = None):
        super().__init__(
            message=message,
            details={"retry_after": retry_after} if retry_after else {},
            status_code=429
        )
        self.retry_after = retry_after


class TimeoutError(CollabGenException):
    """Raised when an operation times out."""
    
    def __init__(self, message: str, operation: str, timeout_seconds: int):
        super().__init__(
            message=message,
            details={"operation": operation, "timeout_seconds": timeout_seconds},
            status_code=504
        )
        self.operation = operation
        self.timeout_seconds = timeout_seconds


class AuthenticationError(CollabGenException):
    """Raised when authentication fails."""
    
    def __init__(self, message: str = "Invalid or missing API key"):
        super().__init__(
            message=message,
            details={},
            status_code=401
        )


class AuthorizationError(CollabGenException):
    """Raised when user lacks permission."""
    
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(
            message=message,
            details={},
            status_code=403
        )
