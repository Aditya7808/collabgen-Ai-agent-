"""
Pipeline API endpoints.
Handles the main agent pipeline execution.
"""
from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.api.middleware import verify_api_key, get_rate_limit_key
from app.config import get_settings
from app.models.requests import PipelineRequest
from app.models.responses import PipelineResponse
from app.services.pipeline_service import get_pipeline_orchestrator

router = APIRouter(prefix="/api/v1", tags=["Pipeline"])

settings = get_settings()
limiter = Limiter(key_func=get_rate_limit_key)


@router.post(
    "/run-pipeline",
    response_model=PipelineResponse,
    summary="Run Full Agent Pipeline",
    description="""
    Execute the complete agent pipeline:
    1. Research Agent - Analyzes companies and collaboration opportunities
    2. Product Agent - Generates product ideas based on research
    3. Marketing Agent - Creates go-to-market strategies
    
    The pipeline runs sequentially, with each agent's output feeding into the next.
    """,
    responses={
        200: {"description": "Pipeline executed successfully"},
        400: {"description": "Invalid request parameters"},
        401: {"description": "Invalid or missing API key"},
        429: {"description": "Rate limit exceeded"},
        500: {"description": "Internal server error"},
        503: {"description": "LLM service unavailable"},
        504: {"description": "Pipeline execution timeout"},
    },
)
async def run_pipeline(
    request: PipelineRequest,
    api_key: str = Depends(verify_api_key),
) -> PipelineResponse:
    """
    Run the complete agent pipeline.
    
    - **company_name**: Primary company for analysis (1-100 chars)
    - **partner_company**: Partner company for collaboration analysis (1-100 chars)
    - **domain**: Industry domain (from whitelist: XR, AI, Robotics, etc.)
    """
    pipeline = get_pipeline_orchestrator()
    return await pipeline.run_pipeline(request)
