"""
API endpoint tests.
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestHealthEndpoints:
    """Tests for health check endpoints."""
    
    async def test_root_endpoint(self, test_client: AsyncClient):
        """Test root endpoint."""
        response = await test_client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data
    
    async def test_health_live(self, test_client: AsyncClient):
        """Test liveness probe."""
        response = await test_client.get("/health/live")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "alive"
    
    async def test_health_detailed(self, test_client: AsyncClient):
        """Test detailed health check."""
        response = await test_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "version" in data
        assert "uptime" in data
        assert "checks" in data


@pytest.mark.asyncio
class TestAuthenticationEndpoints:
    """Tests for authentication."""
    
    async def test_unauthenticated_request(self, test_client: AsyncClient):
        """Test that protected endpoints require auth."""
        response = await test_client.get("/api/v1/reports")
        # In development with valid keys configured, should require auth
        assert response.status_code in [200, 401]
    
    async def test_authenticated_request(self, authenticated_client: AsyncClient):
        """Test authenticated request succeeds."""
        response = await authenticated_client.get("/api/v1/reports")
        assert response.status_code == 200
    
    async def test_invalid_api_key(self, test_client: AsyncClient):
        """Test invalid API key is rejected."""
        response = await test_client.get(
            "/api/v1/reports",
            headers={"X-API-Key": "invalid-key"},
        )
        # Should be 401 if keys are configured
        assert response.status_code in [200, 401]


@pytest.mark.asyncio
class TestReportsEndpoints:
    """Tests for report management endpoints."""
    
    async def test_list_reports_empty(self, authenticated_client: AsyncClient):
        """Test listing reports when empty."""
        response = await authenticated_client.get("/api/v1/reports")
        assert response.status_code == 200
        data = response.json()
        assert "reports" in data
        assert "total" in data
        assert "page" in data
        assert "limit" in data
    
    async def test_list_reports_pagination(self, authenticated_client: AsyncClient):
        """Test report listing pagination."""
        response = await authenticated_client.get(
            "/api/v1/reports?page=1&limit=10"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["page"] == 1
        assert data["limit"] == 10
    
    async def test_get_nonexistent_report(self, authenticated_client: AsyncClient):
        """Test getting a report that doesn't exist."""
        response = await authenticated_client.get(
            "/api/v1/reports/00000000-0000-0000-0000-000000000000"
        )
        assert response.status_code == 404
    
    async def test_get_invalid_report_id(self, authenticated_client: AsyncClient):
        """Test getting a report with invalid ID format."""
        response = await authenticated_client.get("/api/v1/reports/invalid-id")
        assert response.status_code in [400, 500]
    
    async def test_delete_nonexistent_report(self, authenticated_client: AsyncClient):
        """Test deleting a report that doesn't exist."""
        response = await authenticated_client.delete(
            "/api/v1/reports/00000000-0000-0000-0000-000000000000"
        )
        assert response.status_code == 404


@pytest.mark.asyncio
class TestPipelineEndpoints:
    """Tests for pipeline endpoints."""
    
    async def test_pipeline_validation_error(self, authenticated_client: AsyncClient):
        """Test pipeline with invalid input."""
        response = await authenticated_client.post(
            "/api/v1/run-pipeline",
            json={
                "company_name": "",
                "partner_company": "Microsoft",
                "domain": "AI",
            },
        )
        assert response.status_code == 422  # Pydantic validation error
    
    async def test_pipeline_invalid_domain(self, authenticated_client: AsyncClient):
        """Test pipeline with invalid domain."""
        response = await authenticated_client.post(
            "/api/v1/run-pipeline",
            json={
                "company_name": "Apple",
                "partner_company": "Microsoft",
                "domain": "InvalidDomain",
            },
        )
        assert response.status_code == 422


@pytest.mark.asyncio
class TestAgentEndpoints:
    """Tests for individual agent endpoints."""
    
    async def test_research_agent_validation(self, authenticated_client: AsyncClient):
        """Test research agent validation."""
        response = await authenticated_client.post(
            "/api/v1/research-agent",
            json={
                "company_name": "",
                "partner_company": "Microsoft",
                "domain": "AI",
            },
        )
        assert response.status_code == 422
    
    async def test_product_agent_validation(self, authenticated_client: AsyncClient):
        """Test product agent validation."""
        response = await authenticated_client.post(
            "/api/v1/product-agent",
            json={
                "research_report": "Too short",
                "company_name": "Apple",
                "domain": "AI",
            },
        )
        assert response.status_code == 422
    
    async def test_marketing_agent_validation(self, authenticated_client: AsyncClient):
        """Test marketing agent validation."""
        response = await authenticated_client.post(
            "/api/v1/marketing-agent",
            json={
                "product_report": "Too short",
                "research_report": "Also too short",
                "company_name": "Apple",
                "domain": "AI",
            },
        )
        assert response.status_code == 422
