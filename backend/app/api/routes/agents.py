"""
Individual Agent API endpoints.
Allows running agents independently for more granular control.
"""
from fastapi import APIRouter, Depends

from app.api.middleware import verify_api_key
from app.models.requests import (
    ResearchAgentRequest,
    ProductAgentRequest,
    MarketingAgentRequest,
)
from app.models.responses import AgentResponse
from app.agents import ResearchAgent, ProductAgent, MarketingAgent

router = APIRouter(prefix="/api/v1", tags=["Agents"])


@router.post(
    "/research-agent",
    response_model=AgentResponse,
    summary="Run Research Agent",
    description="""
    Execute the Research Agent independently.
    Analyzes companies, markets, and collaboration opportunities.
    
    Roles:
    - Current Business Analyst
    - Future Technology Strategist
    """,
    responses={
        200: {"description": "Research completed successfully"},
        400: {"description": "Invalid request parameters"},
        401: {"description": "Invalid or missing API key"},
        429: {"description": "Rate limit exceeded"},
        500: {"description": "Agent execution error"},
        503: {"description": "LLM service unavailable"},
        504: {"description": "Agent execution timeout"},
    },
)
async def run_research_agent(
    request: ResearchAgentRequest,
    api_key: str = Depends(verify_api_key),
) -> AgentResponse:
    """
    Run the Research Agent.
    
    - **company_name**: Primary company for analysis
    - **partner_company**: Partner company for collaboration
    - **domain**: Industry domain
    """
    agent = ResearchAgent()
    
    try:
        content = await agent.execute(
            company_name=request.company_name,
            partner_company=request.partner_company,
            domain=request.domain,
        )
        return AgentResponse(
            status="success",
            content=content,
            agent_name=agent.name,
            execution_time_ms=agent.execution_time_ms,
        )
    except Exception as e:
        return AgentResponse(
            status="error",
            content="",
            agent_name=agent.name,
            execution_time_ms=agent.execution_time_ms,
            error_message=str(e),
        )


@router.post(
    "/product-agent",
    response_model=AgentResponse,
    summary="Run Product Agent",
    description="""
    Execute the Product Agent independently.
    Generates product ideas, USPs, and feature specifications based on research.
    """,
    responses={
        200: {"description": "Product ideation completed successfully"},
        400: {"description": "Invalid request parameters"},
        401: {"description": "Invalid or missing API key"},
        429: {"description": "Rate limit exceeded"},
        500: {"description": "Agent execution error"},
        503: {"description": "LLM service unavailable"},
        504: {"description": "Agent execution timeout"},
    },
)
async def run_product_agent(
    request: ProductAgentRequest,
    api_key: str = Depends(verify_api_key),
) -> AgentResponse:
    """
    Run the Product Agent.
    
    - **research_report**: Markdown research report from Research Agent
    - **company_name**: Primary company name
    - **domain**: Industry domain
    """
    agent = ProductAgent()
    
    try:
        content = await agent.execute(
            research_report=request.research_report,
            company_name=request.company_name,
            domain=request.domain,
        )
        return AgentResponse(
            status="success",
            content=content,
            agent_name=agent.name,
            execution_time_ms=agent.execution_time_ms,
        )
    except Exception as e:
        return AgentResponse(
            status="error",
            content="",
            agent_name=agent.name,
            execution_time_ms=agent.execution_time_ms,
            error_message=str(e),
        )


@router.post(
    "/marketing-agent",
    response_model=AgentResponse,
    summary="Run Marketing Agent",
    description="""
    Execute the Marketing Agent independently.
    Creates go-to-market strategies, positioning, and marketing plans.
    """,
    responses={
        200: {"description": "Marketing strategy completed successfully"},
        400: {"description": "Invalid request parameters"},
        401: {"description": "Invalid or missing API key"},
        429: {"description": "Rate limit exceeded"},
        500: {"description": "Agent execution error"},
        503: {"description": "LLM service unavailable"},
        504: {"description": "Agent execution timeout"},
    },
)
async def run_marketing_agent(
    request: MarketingAgentRequest,
    api_key: str = Depends(verify_api_key),
) -> AgentResponse:
    """
    Run the Marketing Agent.
    
    - **product_report**: Markdown product report from Product Agent
    - **research_report**: Markdown research report from Research Agent
    - **company_name**: Primary company name
    - **domain**: Industry domain
    """
    agent = MarketingAgent()
    
    try:
        content = await agent.execute(
            product_report=request.product_report,
            research_report=request.research_report,
            company_name=request.company_name,
            domain=request.domain,
        )
        return AgentResponse(
            status="success",
            content=content,
            agent_name=agent.name,
            execution_time_ms=agent.execution_time_ms,
        )
    except Exception as e:
        return AgentResponse(
            status="error",
            content="",
            agent_name=agent.name,
            execution_time_ms=agent.execution_time_ms,
            error_message=str(e),
        )
