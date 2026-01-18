"""
Unit tests for Pydantic models.
"""
import pytest
from pydantic import ValidationError

from app.models.requests import (
    PipelineRequest,
    ResearchAgentRequest,
    ProductAgentRequest,
    MarketingAgentRequest,
    ReportQuery,
)
from app.models.responses import (
    ErrorResponse,
    AgentResponse,
    PipelineResponse,
    HealthResponse,
    HealthCheck,
)


class TestPipelineRequest:
    """Tests for PipelineRequest model."""
    
    def test_valid_request(self):
        """Test valid pipeline request."""
        request = PipelineRequest(
            company_name="Apple Inc",
            partner_company="Microsoft",
            domain="AI",
        )
        assert request.company_name == "Apple Inc"
        assert request.partner_company == "Microsoft"
        assert request.domain == "AI"
    
    def test_company_name_with_special_chars(self):
        """Test company name with allowed special characters."""
        request = PipelineRequest(
            company_name="Johnson & Johnson",
            partner_company="Ben's Bakery",
            domain="Healthcare",
        )
        assert request.company_name == "Johnson & Johnson"
    
    def test_empty_company_name_fails(self):
        """Test that empty company name fails validation."""
        with pytest.raises(ValidationError):
            PipelineRequest(
                company_name="",
                partner_company="Microsoft",
                domain="AI",
            )
    
    def test_company_name_too_long_fails(self):
        """Test that company name over 100 chars fails."""
        with pytest.raises(ValidationError):
            PipelineRequest(
                company_name="A" * 101,
                partner_company="Microsoft",
                domain="AI",
            )
    
    def test_invalid_domain_fails(self):
        """Test that invalid domain fails validation."""
        with pytest.raises(ValidationError):
            PipelineRequest(
                company_name="Apple",
                partner_company="Microsoft",
                domain="InvalidDomain",
            )
    
    def test_xss_in_company_name_fails(self):
        """Test that XSS attempts fail validation."""
        with pytest.raises(ValidationError):
            PipelineRequest(
                company_name="<script>alert('xss')</script>",
                partner_company="Microsoft",
                domain="AI",
            )


class TestReportQuery:
    """Tests for ReportQuery model."""
    
    def test_default_values(self):
        """Test default query values."""
        query = ReportQuery()
        assert query.page == 1
        assert query.limit == 20
        assert query.sort == "created_at"
        assert query.order == "desc"
    
    def test_custom_values(self):
        """Test custom query values."""
        query = ReportQuery(page=2, limit=50, sort="company_name", order="asc")
        assert query.page == 2
        assert query.limit == 50
        assert query.sort == "company_name"
        assert query.order == "asc"
    
    def test_invalid_page_fails(self):
        """Test that page < 1 fails."""
        with pytest.raises(ValidationError):
            ReportQuery(page=0)
    
    def test_limit_over_max_fails(self):
        """Test that limit > 100 fails."""
        with pytest.raises(ValidationError):
            ReportQuery(limit=101)
    
    def test_invalid_sort_fails(self):
        """Test that invalid sort field fails."""
        with pytest.raises(ValidationError):
            ReportQuery(sort="invalid_field")


class TestResponseModels:
    """Tests for response models."""
    
    def test_agent_response(self):
        """Test AgentResponse model."""
        response = AgentResponse(
            status="success",
            content="Test content",
            agent_name="Research Agent",
            execution_time_ms=1500.5,
        )
        assert response.status == "success"
        assert response.error_message is None
    
    def test_agent_response_with_error(self):
        """Test AgentResponse with error."""
        response = AgentResponse(
            status="error",
            content="",
            agent_name="Research Agent",
            execution_time_ms=500.0,
            error_message="LLM API failed",
        )
        assert response.status == "error"
        assert response.error_message == "LLM API failed"
    
    def test_health_check(self):
        """Test HealthCheck model."""
        check = HealthCheck(
            llm_api="ok",
            storage="ok",
            memory="warning",
        )
        assert check.llm_api == "ok"
        assert check.memory == "warning"
    
    def test_health_response(self):
        """Test HealthResponse model."""
        response = HealthResponse(
            status="healthy",
            version="1.0.0",
            uptime=3600.0,
            checks=HealthCheck(
                llm_api="ok",
                storage="ok",
                memory="ok",
            ),
        )
        assert response.status == "healthy"
        assert response.uptime == 3600.0
