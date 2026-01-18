"""
Exception handlers for FastAPI application.
Maps custom exceptions to HTTP responses.
"""
from datetime import datetime
import uuid

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError as PydanticValidationError

from app.utils.exceptions import (
    CollabGenException,
    AgentExecutionError,
    LLMAPIError,
    ValidationError,
    ReportNotFoundError,
    StorageError,
    RateLimitError,
    TimeoutError,
    AuthenticationError,
    AuthorizationError,
)
from app.utils.logging import get_logger

logger = get_logger(__name__)


def create_error_response(
    error_type: str,
    message: str,
    details: dict = None,
    request_id: str = None,
) -> dict:
    """Create a standardized error response."""
    return {
        "error": error_type,
        "message": message,
        "details": details,
        "timestamp": datetime.utcnow().isoformat(),
        "request_id": request_id or str(uuid.uuid4()),
    }


async def collabgen_exception_handler(
    request: Request, exc: CollabGenException
) -> JSONResponse:
    """Handle all CollabGen custom exceptions."""
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    
    logger.error(
        f"{type(exc).__name__}: {exc.message}",
        error_type=type(exc).__name__,
        details=exc.details,
        request_id=request_id,
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content=create_error_response(
            error_type=type(exc).__name__,
            message=exc.message,
            details=exc.details,
            request_id=request_id,
        ),
    )


async def validation_error_handler(
    request: Request, exc: PydanticValidationError
) -> JSONResponse:
    """Handle Pydantic validation errors."""
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    
    # Format validation errors
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"])
        errors.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"],
        })
    
    logger.warning(
        "Validation error",
        errors=errors,
        request_id=request_id,
    )
    
    return JSONResponse(
        status_code=400,
        content=create_error_response(
            error_type="ValidationError",
            message="Request validation failed",
            details={"errors": errors},
            request_id=request_id,
        ),
    )


async def generic_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    """Handle unexpected exceptions."""
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    
    logger.exception(
        "Unhandled exception",
        error=str(exc),
        error_type=type(exc).__name__,
        request_id=request_id,
    )
    
    return JSONResponse(
        status_code=500,
        content=create_error_response(
            error_type="InternalServerError",
            message="An unexpected error occurred",
            details=None,  # Don't expose internal error details
            request_id=request_id,
        ),
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Register all exception handlers with the FastAPI app."""
    
    # Custom exceptions
    app.add_exception_handler(CollabGenException, collabgen_exception_handler)
    app.add_exception_handler(AgentExecutionError, collabgen_exception_handler)
    app.add_exception_handler(LLMAPIError, collabgen_exception_handler)
    app.add_exception_handler(ValidationError, collabgen_exception_handler)
    app.add_exception_handler(ReportNotFoundError, collabgen_exception_handler)
    app.add_exception_handler(StorageError, collabgen_exception_handler)
    app.add_exception_handler(RateLimitError, collabgen_exception_handler)
    app.add_exception_handler(TimeoutError, collabgen_exception_handler)
    app.add_exception_handler(AuthenticationError, collabgen_exception_handler)
    app.add_exception_handler(AuthorizationError, collabgen_exception_handler)
    
    # Pydantic validation errors
    app.add_exception_handler(PydanticValidationError, validation_error_handler)
    
    # Catch-all for unexpected errors
    app.add_exception_handler(Exception, generic_exception_handler)
