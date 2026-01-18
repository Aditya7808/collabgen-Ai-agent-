"""
Pytest configuration and shared fixtures.
"""
import asyncio
import os
import sys
from typing import AsyncGenerator, Generator
import pytest
from httpx import AsyncClient

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set test environment variables BEFORE importing app
os.environ["OPENAI_API_KEY"] = "test-api-key"
os.environ["OPENAI_MODEL"] = "gpt-4-turbo-preview"
os.environ["ENVIRONMENT"] = "development"
os.environ["DEBUG"] = "true"
os.environ["VALID_API_KEYS"] = "test-key-123"

from app.main import app
from app.config import get_settings


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def settings():
    """Get test settings."""
    return get_settings()


@pytest.fixture
async def test_client() -> AsyncGenerator[AsyncClient, None]:
    """Create test client for API testing."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest.fixture
async def authenticated_client() -> AsyncGenerator[AsyncClient, None]:
    """Create authenticated test client."""
    async with AsyncClient(
        app=app,
        base_url="http://test",
        headers={"X-API-Key": "test-key-123"},
    ) as client:
        yield client


@pytest.fixture
def sample_pipeline_request():
    """Sample pipeline request data."""
    return {
        "company_name": "Apple Inc",
        "partner_company": "Microsoft",
        "domain": "AI",
    }


@pytest.fixture
def sample_research_report():
    """Sample research report markdown."""
    return """
# Research Report: Apple Inc & Microsoft

## Company Overview

### Apple Inc
Apple is a technology company known for its consumer electronics...

### Microsoft
Microsoft is a global technology leader...

## Market Analysis

The technology market continues to grow...

## Collaboration Opportunities

Both companies have complementary strengths...
"""


@pytest.fixture
def sample_product_report():
    """Sample product report markdown."""
    return """
# Product Strategy Report

## Product Vision

Create innovative AI-powered solutions...

## Product Concepts

### Concept 1: AI Assistant

**USP**: Revolutionary AI-powered assistant...

**Features**:
- Feature 1: Natural language understanding
- Feature 2: Cross-platform integration
"""


@pytest.fixture
def mock_gemini_response():
    """Mock Gemini API response."""
    return {
        "text": """
# Generated Report

## Section 1
This is a comprehensive analysis...

## Section 2
Here are the recommendations...

## Section 3
Conclusion and next steps...
""" * 10  # Make it long enough to pass validation
    }


@pytest.fixture
def invalid_pipeline_requests():
    """Various invalid pipeline request scenarios."""
    return [
        {
            "name": "empty_company_name",
            "data": {
                "company_name": "",
                "partner_company": "Microsoft",
                "domain": "AI",
            },
            "expected_error": "company_name",
        },
        {
            "name": "invalid_domain",
            "data": {
                "company_name": "Apple",
                "partner_company": "Microsoft",
                "domain": "InvalidDomain",
            },
            "expected_error": "domain",
        },
        {
            "name": "company_name_too_long",
            "data": {
                "company_name": "A" * 150,
                "partner_company": "Microsoft",
                "domain": "AI",
            },
            "expected_error": "company_name",
        },
        {
            "name": "special_characters",
            "data": {
                "company_name": "Apple<script>alert('xss')</script>",
                "partner_company": "Microsoft",
                "domain": "AI",
            },
            "expected_error": "company_name",
        },
    ]
