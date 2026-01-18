"""Routes package - exports all routers."""
from fastapi import APIRouter

from app.api.routes.pipeline import router as pipeline_router
from app.api.routes.agents import router as agents_router
from app.api.routes.reports import router as reports_router
from app.api.routes.health import router as health_router

# Main router that includes all sub-routers
api_router = APIRouter()

# Include all routers
api_router.include_router(pipeline_router)
api_router.include_router(agents_router)
api_router.include_router(reports_router)
api_router.include_router(health_router)

__all__ = ["api_router"]
