"""
Pipeline Orchestrator - Coordinates the execution of all agents in sequence.
Handles the Research → Product → Marketing pipeline flow.
"""
import asyncio
import time
import uuid
from datetime import datetime
from typing import Optional

from app.agents import ResearchAgent, ProductAgent, MarketingAgent, CriticAgent
from app.config import get_settings
from app.models.requests import PipelineRequest
from app.models.responses import (
    PipelineResponse,
    PipelineMetadata,
    PipelineSections,
    SectionStatus,
)
from app.services.llm_service import get_llm_service
from app.services.report_service import get_report_service
from app.utils.exceptions import AgentExecutionError, TimeoutError as CustomTimeoutError
from app.utils.logging import get_logger

logger = get_logger(__name__)


class PipelineOrchestrator:
    """
    Orchestrates the execution of the agent pipeline.
    
    Pipeline Flow: Research → Product → Marketing
    Each agent's output feeds into the next agent.
    """
    
    def __init__(self):
        self.settings = get_settings()
        self.research_agent = ResearchAgent()
        self.product_agent = ProductAgent()
        self.marketing_agent = MarketingAgent()
        self.critic_agent = CriticAgent()
        self.llm_service = get_llm_service()
        self.report_service = get_report_service()
    
    async def run_pipeline(
        self,
        request: PipelineRequest,
        save_report: bool = True,
    ) -> PipelineResponse:
        """
        Execute the full agent pipeline.
        
        Args:
            request: Pipeline request with company info
            save_report: Whether to save the report to storage
            
        Returns:
            PipelineResponse with combined report
        """
        start_time = time.time()
        report_id = str(uuid.uuid4())
        
        # Initialize section statuses
        research_status = SectionStatus(status="failed", content="", error=None)
        product_status = SectionStatus(status="skipped", content="", error=None)
        marketing_status = SectionStatus(status="skipped", content="", error=None)
        
        # Reset token counter
        self.llm_service.reset_token_count()
        
        logger.info(
            "Pipeline execution started",
            report_id=report_id,
            company_name=request.company_name,
            partner_company=request.partner_company,
            domain=request.domain,
        )
        
        # Track results
        research_content = ""
        product_content = ""
        marketing_content = ""
        overall_status = "failed"
        
        try:
            # Step 1: Research Agent
            logger.info("Starting Research Agent", report_id=report_id)
            try:
                research_content = await asyncio.wait_for(
                    self.research_agent.execute(
                        company_name=request.company_name,
                        partner_company=request.partner_company,
                        domain=request.domain,
                    ),
                    timeout=self.settings.TIMEOUT_RESEARCH_AGENT,
                )
                research_status = SectionStatus(
                    status="completed",
                    content=research_content,
                    error=None,
                )
                logger.info(
                    "Research Agent completed",
                    report_id=report_id,
                    content_length=len(research_content),
                )
            except asyncio.TimeoutError:
                research_status = SectionStatus(
                    status="failed",
                    content="",
                    error="Research agent timed out",
                )
                logger.error("Research Agent timed out", report_id=report_id)
            except AgentExecutionError as e:
                research_status = SectionStatus(
                    status="failed",
                    content="",
                    error=str(e),
                )
                logger.error("Research Agent failed", report_id=report_id, error=str(e))
            
            # Step 2: Product Agent (only if research succeeded)
            if research_status.status == "completed":
                logger.info("Starting Product Agent", report_id=report_id)
                try:
                    product_content = await asyncio.wait_for(
                        self.product_agent.execute(
                            research_report=research_content,
                            company_name=request.company_name,
                            domain=request.domain,
                        ),
                        timeout=self.settings.TIMEOUT_PRODUCT_AGENT,
                    )
                    product_status = SectionStatus(
                        status="completed",
                        content=product_content,
                        error=None,
                    )
                    logger.info(
                        "Product Agent completed",
                        report_id=report_id,
                        content_length=len(product_content),
                    )
                except asyncio.TimeoutError:
                    product_status = SectionStatus(
                        status="failed",
                        content="",
                        error="Product agent timed out",
                    )
                    logger.error("Product Agent timed out", report_id=report_id)
                except AgentExecutionError as e:
                    product_status = SectionStatus(
                        status="failed",
                        content="",
                        error=str(e),
                    )
                    logger.error("Product Agent failed", report_id=report_id, error=str(e))
            
            # Step 3: Marketing Agent (only if product succeeded)
            if product_status.status == "completed":
                logger.info("Starting Marketing Agent", report_id=report_id)
                try:
                    marketing_content = await asyncio.wait_for(
                        self.marketing_agent.execute(
                            product_report=product_content,
                            research_report=research_content,
                            company_name=request.company_name,
                            domain=request.domain,
                        ),
                        timeout=self.settings.TIMEOUT_MARKETING_AGENT,
                    )
                    marketing_status = SectionStatus(
                        status="completed",
                        content=marketing_content,
                        error=None,
                    )
                    logger.info(
                        "Marketing Agent completed",
                        report_id=report_id,
                        content_length=len(marketing_content),
                    )
                except asyncio.TimeoutError:
                    marketing_status = SectionStatus(
                        status="failed",
                        content="",
                        error="Marketing agent timed out",
                    )
                    logger.error("Marketing Agent timed out", report_id=report_id)
                except AgentExecutionError as e:
                    marketing_status = SectionStatus(
                        status="failed",
                        content="",
                        error=str(e),
                    )
                    logger.error("Marketing Agent failed", report_id=report_id, error=str(e))
            
            # Determine overall status
            statuses = [
                research_status.status,
                product_status.status,
                marketing_status.status,
            ]
            if all(s == "completed" for s in statuses):
                overall_status = "completed"
            elif any(s == "completed" for s in statuses):
                overall_status = "partial"
            else:
                overall_status = "failed"
            
            # Combine content
            combined_content = self._combine_reports(
                company_name=request.company_name,
                partner_company=request.partner_company,
                domain=request.domain,
                research=research_content,
                product=product_content,
                marketing=marketing_content,
                report_id=report_id,
            )
            
        except asyncio.CancelledError:
            logger.warning("Pipeline was cancelled", report_id=report_id)
            raise
        except Exception as e:
            logger.error(
                "Pipeline execution failed",
                report_id=report_id,
                error=str(e),
                error_type=type(e).__name__,
            )
            combined_content = ""
        
        # Calculate execution time
        execution_time_ms = (time.time() - start_time) * 1000
        
        # Create response
        response = PipelineResponse(
            report_id=report_id,
            status=overall_status,
            content=combined_content,
            sections=PipelineSections(
                research=research_status,
                product=product_status,
                marketing=marketing_status,
            ),
            metadata=PipelineMetadata(
                created_at=datetime.utcnow(),
                execution_time_ms=execution_time_ms,
                tokens_used=self.llm_service.tokens_used,
            ),
        )
        
        # Save report if requested
        if save_report:
            try:
                await self.report_service.save_report(
                    report=response,
                    request_data={
                        "company_name": request.company_name,
                        "partner_company": request.partner_company,
                        "domain": request.domain,
                    },
                )
            except Exception as e:
                logger.error("Failed to save report", report_id=report_id, error=str(e))
                # Don't fail the response, just log the error
        
        logger.info(
            "Pipeline execution completed",
            report_id=report_id,
            status=overall_status,
            execution_time_ms=execution_time_ms,
            tokens_used=self.llm_service.tokens_used,
        )
        
        return response
    
    def _combine_reports(
        self,
        company_name: str,
        partner_company: str,
        domain: str,
        research: str,
        product: str,
        marketing: str,
        report_id: str,
    ) -> str:
        """Combine all agent outputs into a single report."""
        sections = []
        
        # Header
        header = f"""# Collaboration Report: {company_name} & {partner_company}

**Domain**: {domain}  
**Report ID**: {report_id}  
**Generated**: {datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")}

---

"""
        sections.append(header)
        
        # Research section
        if research:
            sections.append("# Part 1: Research Analysis\n\n")
            sections.append(research)
            sections.append("\n\n---\n\n")
        
        # Product section
        if product:
            sections.append("# Part 2: Product Strategy\n\n")
            sections.append(product)
            sections.append("\n\n---\n\n")
        
        # Marketing section
        if marketing:
            sections.append("# Part 3: Marketing Strategy\n\n")
            sections.append(marketing)
        
        return "".join(sections)


# Singleton instance
_pipeline_orchestrator: Optional[PipelineOrchestrator] = None


def get_pipeline_orchestrator() -> PipelineOrchestrator:
    """Get the pipeline orchestrator singleton."""
    global _pipeline_orchestrator
    if _pipeline_orchestrator is None:
        _pipeline_orchestrator = PipelineOrchestrator()
    return _pipeline_orchestrator
