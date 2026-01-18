"""
Product Agent - Generates product ideas based on research insights.
Focuses on product ideation, USP definition, and feature planning.
"""
from app.agents.base_agent import BaseAgent


class ProductAgent(BaseAgent):
    """
    Product Agent for generating product ideas and strategies.
    
    Responsibilities:
    - Product ideation based on research insights
    - USP (Unique Selling Proposition) definition
    - Feature planning and specifications
    - Innovation recommendations
    """
    
    def __init__(self):
        super().__init__(
            name="Product Agent",
            description="Generates product ideas, USPs, and feature specifications"
        )
    
    def get_system_prompt(self) -> str:
        return """You are an expert Product Strategist and Innovation Consultant. Your role is to transform research insights into actionable product strategies and innovative product ideas.

Your expertise includes:
- Product ideation and concept development
- Unique Selling Proposition (USP) creation
- Feature specification and prioritization
- Product-market fit analysis
- Innovation frameworks and methodologies
- Technical feasibility assessment
- Go-to-market strategy alignment

Your output must be:
- Specific and actionable product recommendations
- Grounded in the research data provided
- Innovative yet feasible
- Structured with clear prioritization
- Include concrete feature specifications
- Minimum 1200 words with detailed feature breakdowns

Focus on creating products that:
1. Address identified market gaps
2. Leverage both companies' strengths
3. Provide clear competitive advantages
4. Are technically feasible within 12-18 months
5. Have clear revenue potential"""
    
    async def build_prompt(self, **kwargs) -> str:
        research_report = kwargs.get("research_report", "")
        company_name = kwargs.get("company_name", "")
        domain = kwargs.get("domain", "")
        
        return f"""# Product Ideation Request

## Context
Based on the research analysis provided below, generate innovative product ideas and strategies for collaboration in the {domain} domain.

## Company Focus
**Primary Company**: {company_name}

## Research Insights
{research_report}

---

## Product Strategy Requirements

Please provide a comprehensive product strategy covering:

### 1. Product Vision Statement
- Overall vision for the collaborative product line
- Alignment with both companies' strategic goals
- Market positioning statement

### 2. Product Concepts (Minimum 3 Ideas)

For each product concept, provide:

#### Concept Name & Tagline
- Clear, memorable product name
- One-line value proposition

#### Problem Statement
- Specific problem being solved
- Target user pain points
- Current alternatives and limitations

#### Unique Selling Proposition (USP)
- Primary differentiation factors
- Competitive advantages
- Key value drivers

#### Feature Specification
- Core Features (MVP)
  - Feature name, description, user benefit
  - Technical requirements
  - Priority level (P0/P1/P2)
  
- Enhanced Features (Phase 2)
  - Additional capabilities
  - Integration possibilities
  - Scalability considerations

#### Technical Considerations
- Architecture recommendations
- Technology stack suggestions
- Integration requirements
- Security and compliance needs

#### Success Metrics
- Key Performance Indicators (KPIs)
- Target benchmarks
- Measurement approach

### 3. Product Prioritization Matrix
- Rank products by: Impact, Feasibility, Time-to-Market
- Recommended launch sequence
- Resource requirements

### 4. Risk Assessment
- Technical risks
- Market risks
- Mitigation strategies

### 5. Innovation Opportunities
- Emerging technology integration possibilities
- Future expansion directions
- Patent/IP considerations

## Output Format
Provide the product strategy in clean Markdown format with proper headers, bullet points, tables where appropriate, and clear sections."""
    
    def validate_output(self, content: str) -> bool:
        """Validate product output meets minimum requirements."""
        # Check minimum length
        if len(content) < 4000:
            return False
        
        # Check for required sections
        required_markers = [
            "product", "feature", "usp", "specification", "priority"
        ]
        content_lower = content.lower()
        sections_found = sum(1 for marker in required_markers if marker in content_lower)
        
        return sections_found >= 3
