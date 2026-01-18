"""
Pydantic models for API responses.
Implements structured response formats as per specification.
"""
from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field
import uuid


class ErrorResponse(BaseModel):
    """Standard error response format."""
    
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Human-readable error message")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Additional error context")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))


class AgentResponse(BaseModel):
    """Response from individual agent execution."""
    
    status: Literal["success", "error"] = Field(...)
    content: str = Field(default="", description="Markdown content")
    agent_name: str = Field(...)
    execution_time_ms: float = Field(...)
    error_message: Optional[str] = Field(default=None)


class SectionStatus(BaseModel):
    """Status of a pipeline section."""
    
    status: Literal["completed", "failed", "skipped"] = Field(...)
    content: str = Field(default="")
    error: Optional[str] = Field(default=None)


class PipelineMetadata(BaseModel):
    """Metadata for pipeline execution."""
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    execution_time_ms: float = Field(...)
    tokens_used: int = Field(default=0)


class PipelineSections(BaseModel):
    """Sections of the pipeline report."""
    
    research: SectionStatus
    product: SectionStatus
    marketing: SectionStatus


class PipelineResponse(BaseModel):
    """Response from full pipeline execution."""
    
    report_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: Literal["completed", "partial", "failed"] = Field(...)
    content: str = Field(default="", description="Combined Markdown report")
    sections: PipelineSections
    metadata: PipelineMetadata


class ReportSummary(BaseModel):
    """Summary of a stored report."""
    
    report_id: str = Field(...)
    company_name: str = Field(...)
    partner_company: str = Field(...)
    domain: str = Field(...)
    status: Literal["completed", "partial", "failed"] = Field(...)
    created_at: datetime = Field(...)
    execution_time_ms: float = Field(...)


class ReportDetail(BaseModel):
    """Full report details."""
    
    report_id: str = Field(...)
    company_name: str = Field(...)
    partner_company: str = Field(...)
    domain: str = Field(...)
    status: Literal["completed", "partial", "failed"] = Field(...)
    content: str = Field(...)
    sections: PipelineSections
    created_at: datetime = Field(...)
    execution_time_ms: float = Field(...)
    tokens_used: int = Field(default=0)


class ReportListResponse(BaseModel):
    """Paginated list of reports."""
    
    reports: List[ReportSummary] = Field(default_factory=list)
    total: int = Field(...)
    page: int = Field(...)
    limit: int = Field(...)


class HealthCheck(BaseModel):
    """Detailed health check status."""
    
    llm_api: Literal["ok", "error"] = Field(...)
    storage: Literal["ok", "error"] = Field(...)
    memory: Literal["ok", "warning", "critical"] = Field(...)


class HealthResponse(BaseModel):
    """Health check response."""
    
    status: Literal["healthy", "degraded", "unhealthy"] = Field(...)
    version: str = Field(...)
    uptime: float = Field(..., description="Uptime in seconds")
    checks: HealthCheck
