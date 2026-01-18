"""
Pydantic models for API request validation.
Implements strict validation rules as per specification.
"""
import re
from typing import Optional
from pydantic import BaseModel, Field, field_validator

from app.config import get_settings


class PipelineRequest(BaseModel):
    """Request model for the full agent pipeline."""
    
    company_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Primary company name for analysis"
    )
    partner_company: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Partner company name for collaboration analysis"
    )
    domain: str = Field(
        ...,
        description="Industry domain (from whitelist)"
    )
    
    @field_validator("company_name", "partner_company")
    @classmethod
    def validate_company_name(cls, v: str) -> str:
        """Validate company name format."""
        v = v.strip()
        if not re.match(r"^[a-zA-Z0-9\s\-\.&']+$", v):
            raise ValueError(
                "Company name must contain only alphanumeric characters, spaces, hyphens, dots, ampersands, and apostrophes"
            )
        return v
    
    @field_validator("domain")
    @classmethod
    def validate_domain(cls, v: str) -> str:
        """Validate domain against whitelist."""
        settings = get_settings()
        v = v.strip()
        allowed = settings.allowed_domains_list
        if v not in allowed:
            raise ValueError(f"Domain must be one of: {', '.join(allowed)}")
        return v


class ResearchAgentRequest(BaseModel):
    """Request model for the Research Agent."""
    
    company_name: str = Field(..., min_length=1, max_length=100)
    partner_company: str = Field(..., min_length=1, max_length=100)
    domain: str = Field(...)
    
    @field_validator("company_name", "partner_company")
    @classmethod
    def validate_company_name(cls, v: str) -> str:
        v = v.strip()
        if not re.match(r"^[a-zA-Z0-9\s\-\.&']+$", v):
            raise ValueError("Invalid company name format")
        return v
    
    @field_validator("domain")
    @classmethod
    def validate_domain(cls, v: str) -> str:
        settings = get_settings()
        v = v.strip()
        if v not in settings.allowed_domains_list:
            raise ValueError(f"Invalid domain. Allowed: {settings.allowed_domains_list}")
        return v


class ProductAgentRequest(BaseModel):
    """Request model for the Product Agent."""
    
    research_report: str = Field(
        ...,
        min_length=100,
        description="Markdown research report from Research Agent"
    )
    company_name: str = Field(..., min_length=1, max_length=100)
    domain: str = Field(...)
    
    @field_validator("research_report")
    @classmethod
    def validate_research_report(cls, v: str) -> str:
        settings = get_settings()
        if len(v) > settings.MAX_MARKDOWN_LENGTH:
            raise ValueError(f"Research report exceeds maximum length of {settings.MAX_MARKDOWN_LENGTH} characters")
        return v


class MarketingAgentRequest(BaseModel):
    """Request model for the Marketing Agent."""
    
    product_report: str = Field(
        ...,
        min_length=100,
        description="Markdown product report from Product Agent"
    )
    research_report: str = Field(
        ...,
        min_length=100,
        description="Markdown research report from Research Agent"
    )
    company_name: str = Field(..., min_length=1, max_length=100)
    domain: str = Field(...)
    
    @field_validator("product_report", "research_report")
    @classmethod
    def validate_reports(cls, v: str) -> str:
        settings = get_settings()
        if len(v) > settings.MAX_MARKDOWN_LENGTH:
            raise ValueError(f"Report exceeds maximum length of {settings.MAX_MARKDOWN_LENGTH} characters")
        return v


class ReportQuery(BaseModel):
    """Query parameters for report listing."""
    
    page: int = Field(default=1, ge=1, description="Page number")
    limit: int = Field(default=20, ge=1, le=100, description="Items per page")
    sort: str = Field(default="created_at", pattern="^(created_at|company_name)$")
    order: str = Field(default="desc", pattern="^(asc|desc)$")
