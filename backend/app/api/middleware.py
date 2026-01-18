"""
Security middleware and dependencies.
Implements API key authentication, rate limiting, and security headers.
"""
import hashlib
import secrets
import time
from typing import Optional
import uuid

from fastapi import Depends, Header, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import structlog

from app.config import get_settings
from app.utils.exceptions import AuthenticationError, RateLimitError

logger = structlog.get_logger(__name__)


# Rate limiter configuration
def get_rate_limit_key(request: Request) -> str:
    """
    Get the rate limit key - API key if authenticated, otherwise IP.
    """
    api_key = request.headers.get("X-API-Key")
    if api_key:
        # Hash the API key for privacy in rate limit storage
        return hashlib.sha256(api_key.encode()).hexdigest()[:16]
    return get_remote_address(request)


limiter = Limiter(key_func=get_rate_limit_key)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers to all responses."""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        settings = get_settings()
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # CSP: Relaxed for development (Swagger UI), strict for production
        if settings.ENVIRONMENT == "production":
            response.headers["Content-Security-Policy"] = "default-src 'self'"
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains"
            )
        else:
            # Allow Swagger UI resources in development
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
                "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
                "img-src 'self' data: https://fastapi.tiangolo.com; "
                "font-src 'self' https://cdn.jsdelivr.net;"
            )
        
        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all requests with timing."""
    
    async def dispatch(self, request: Request, call_next):
        # Generate or get request ID
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        
        # Bind request context for logging
        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            method=request.method,
            path=request.url.path,
        )
        
        start_time = time.time()
        
        # Process request
        try:
            response = await call_next(request)
            
            # Log successful request
            duration_ms = (time.time() - start_time) * 1000
            logger.info(
                "Request completed",
                status_code=response.status_code,
                duration_ms=round(duration_ms, 2),
            )
            
            # Add request ID to response
            response.headers["X-Request-ID"] = request_id
            
            return response
            
        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            logger.error(
                "Request failed",
                error=str(e),
                error_type=type(e).__name__,
                duration_ms=round(duration_ms, 2),
            )
            raise
        finally:
            # Clear context
            structlog.contextvars.unbind_contextvars("request_id", "method", "path")


async def verify_api_key(
    x_api_key: Optional[str] = Header(None, alias="X-API-Key")
) -> Optional[str]:
    """
    Verify the API key from request header.
    
    Returns:
        The validated API key or None if no key required
        
    Raises:
        AuthenticationError: If key is invalid
    """
    settings = get_settings()
    
    # In development, API key might be optional
    if settings.ENVIRONMENT == "development" and not settings.valid_api_keys_list:
        return None
    
    # If valid keys are configured, require authentication
    if settings.valid_api_keys_list:
        if not x_api_key:
            raise AuthenticationError("Missing API key")
        
        # Check if key is valid
        if x_api_key not in settings.valid_api_keys_list:
            # Use constant-time comparison to prevent timing attacks
            for valid_key in settings.valid_api_keys_list:
                if secrets.compare_digest(x_api_key, valid_key):
                    return x_api_key
            raise AuthenticationError("Invalid API key")
        
        return x_api_key
    
    return None


async def optional_api_key(
    x_api_key: Optional[str] = Header(None, alias="X-API-Key")
) -> Optional[str]:
    """
    Optional API key - doesn't require auth but validates if provided.
    """
    settings = get_settings()
    
    if x_api_key and settings.valid_api_keys_list:
        if x_api_key not in settings.valid_api_keys_list:
            return None
    
    return x_api_key
