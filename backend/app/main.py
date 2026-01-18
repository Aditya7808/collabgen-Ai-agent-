"""
CollabGen-Agent FastAPI Application
Main entry point for the backend API.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import get_settings
from app.api import (
    api_router,
    SecurityHeadersMiddleware,
    RequestLoggingMiddleware,
    register_exception_handlers,
    limiter,
)
from app.utils.logging import setup_logging, get_logger


# Setup logging
setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    settings = get_settings()
    logger.info(
        "Application starting",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
    )
    
    # Startup tasks
    yield
    
    # Shutdown tasks
    logger.info("Application shutting down")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="""
# CollabGen-Agent API

A multi-agent AI system for generating comprehensive collaboration reports.

## Features

- **Research Agent**: Analyzes companies and identifies collaboration opportunities
- **Product Agent**: Generates product ideas and specifications
- **Marketing Agent**: Creates go-to-market strategies

## Pipeline

The agents work in sequence:
1. Research → 2. Product → 3. Marketing

Each agent's output feeds into the next, creating a comprehensive collaboration report.

## Authentication

All endpoints (except health checks) require an API key via the `X-API-Key` header.
        """,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )
    
    # Add rate limiter
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "DELETE"],
        allow_headers=["Content-Type", "X-API-Key", "Authorization", "X-Request-ID"],
        max_age=3600,
    )
    
    # Add security headers middleware
    app.add_middleware(SecurityHeadersMiddleware)
    
    # Add request logging middleware
    app.add_middleware(RequestLoggingMiddleware)
    
    # Register exception handlers
    register_exception_handlers(app)
    
    # Include routers
    app.include_router(api_router)
    
    # Root endpoint
    @app.get("/", tags=["Root"])
    async def root():
        """Root endpoint with API information."""
        return {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
            "docs": "/docs",
            "health": "/health",
        }
    
    return app


# Create the application instance
app = create_app()


if __name__ == "__main__":
    import uvicorn
    
    settings = get_settings()
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
