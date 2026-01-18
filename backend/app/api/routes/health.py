"""
Health Check API endpoints.
Provides liveness, readiness, and detailed health status.
"""
import psutil
import time
from typing import Literal

from fastapi import APIRouter
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response

from app.config import get_settings
from app.models.responses import HealthResponse, HealthCheck
from app.services.llm_service import get_llm_service
from app.services.report_service import get_report_service

router = APIRouter(tags=["Health"])

# Track application start time
_start_time = time.time()


def get_uptime() -> float:
    """Get application uptime in seconds."""
    return time.time() - _start_time


def get_memory_status() -> Literal["ok", "warning", "critical"]:
    """Get memory usage status."""
    try:
        memory = psutil.virtual_memory()
        usage_percent = memory.percent
        
        if usage_percent >= 90:
            return "critical"
        elif usage_percent >= 75:
            return "warning"
        return "ok"
    except Exception:
        return "warning"


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Detailed Health Check",
    description="Returns detailed health status including all dependency checks.",
)
async def health_check() -> HealthResponse:
    """
    Comprehensive health check.
    
    Returns status of:
    - LLM API connectivity
    - Storage availability
    - Memory usage
    """
    settings = get_settings()
    
    # Check LLM API
    llm_service = get_llm_service()
    llm_status: Literal["ok", "error"] = "ok" if await llm_service.health_check() else "error"
    
    # Check storage
    report_service = get_report_service()
    storage_status: Literal["ok", "error"] = "ok" if await report_service.health_check() else "error"
    
    # Check memory
    memory_status = get_memory_status()
    
    # Determine overall status
    checks = HealthCheck(
        llm_api=llm_status,
        storage=storage_status,
        memory=memory_status,
    )
    
    if llm_status == "error" or storage_status == "error":
        overall_status: Literal["healthy", "degraded", "unhealthy"] = "unhealthy"
    elif memory_status == "critical":
        overall_status = "unhealthy"
    elif memory_status == "warning" or llm_status == "error":
        overall_status = "degraded"
    else:
        overall_status = "healthy"
    
    return HealthResponse(
        status=overall_status,
        version=settings.APP_VERSION,
        uptime=get_uptime(),
        checks=checks,
    )


@router.get(
    "/health/live",
    summary="Liveness Probe",
    description="Simple liveness check for container orchestrators.",
    responses={
        200: {"description": "Application is alive"},
    },
)
async def liveness() -> dict:
    """
    Liveness probe - checks if the application is running.
    
    Used by Kubernetes/Docker for restart decisions.
    """
    return {"status": "alive"}


@router.get(
    "/health/ready",
    summary="Readiness Probe",
    description="Readiness check - verifies the application can handle requests.",
    responses={
        200: {"description": "Application is ready"},
        503: {"description": "Application is not ready"},
    },
)
async def readiness() -> dict:
    """
    Readiness probe - checks if the application can serve traffic.
    
    Used by load balancers for routing decisions.
    """
    # Check critical dependencies
    llm_service = get_llm_service()
    report_service = get_report_service()
    
    llm_ok = await llm_service.health_check()
    storage_ok = await report_service.health_check()
    
    if not storage_ok:
        # Storage is critical
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="Storage not ready")
    
    # LLM being down is degraded but can still serve cached content
    return {
        "status": "ready",
        "llm_available": llm_ok,
        "storage_available": storage_ok,
    }


@router.get(
    "/metrics",
    summary="Prometheus Metrics",
    description="Exposes application metrics in Prometheus format.",
)
async def metrics() -> Response:
    """
    Prometheus metrics endpoint.
    
    Exposes:
    - HTTP request counts and latencies
    - Pipeline execution metrics
    - LLM API call metrics
    - System metrics
    """
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST,
    )
