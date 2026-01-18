"""
Research Agent - Analyzes companies and collaboration opportunities.
Consists of Current Business Analyst and Future Technology Strategist roles.
"""
from app.agents.base_agent import BaseAgent


class ResearchAgent(BaseAgent):
    """
    Research Agent for analyzing companies and identifying collaboration opportunities.
    
    Roles:
    - Current Business Analyst: Research present market operations
    - Future Technology Strategist: Explore future technologies and opportunities
    """
    
    def __init__(self):
        super().__init__(
            name="Research Agent",
            description="Analyzes companies, markets, and collaboration opportunities"
        )
    
    def get_system_prompt(self) -> str:
        return """You are an expert Business Research Analyst and Technology Strategist. Your role is to provide comprehensive research on companies and their potential collaboration opportunities.

You have two distinct perspectives:

1. **Current Business Analyst**:
   - Research present market operations of both companies
   - Gather current product portfolios & pricing information
   - Analyze existing business relationships and partnerships
   - Collect available financial data & market share information
   - Document current technology capabilities and infrastructure

2. **Future Technology Strategist**:
   - Explore future technology roadmaps in the specified domain
   - Investigate R&D investments and patent landscapes
   - Analyze emerging technology trends relevant to both companies
   - Identify potential collaboration opportunities
   - Assess future market positioning and growth potential

Your output must be:
- Well-structured in Markdown format
- Data-driven with specific examples and metrics where available
- Balanced between current state analysis and future opportunities
- Actionable for product and marketing teams
- Minimum 1500 words with at least 3 key data points per section"""
    
    async def build_prompt(self, **kwargs) -> str:
        company_name = kwargs.get("company_name", "")
        partner_company = kwargs.get("partner_company", "")
        domain = kwargs.get("domain", "")
        
        return f"""# Research Analysis Request

## Companies Under Analysis
- **Primary Company**: {company_name}
- **Partner Company**: {partner_company}
- **Industry Domain**: {domain}

## Research Requirements

Please provide a comprehensive research report covering:

### Part 1: Current Business Analysis

#### {company_name} Profile
- Company overview and history
- Current product/service portfolio
- Market position and competitive landscape
- Key financials (revenue, growth, market cap if public)
- Technology stack and capabilities
- Recent news and developments

#### {partner_company} Profile
- Company overview and history
- Current product/service portfolio
- Market position and competitive landscape
- Key financials (revenue, growth, market cap if public)
- Technology stack and capabilities
- Recent news and developments

#### Current Relationship Analysis
- Existing partnerships or collaborations (if any)
- Competitive dynamics
- Complementary capabilities
- Shared customers or markets

### Part 2: Future Technology Strategy

#### {domain} Industry Trends
- Emerging technologies shaping the industry
- Market size and growth projections
- Key players and disruptors
- Regulatory landscape

#### Collaboration Opportunities
- Technology synergies between both companies
- Joint product/service possibilities
- Market expansion opportunities
- R&D collaboration potential

#### Strategic Recommendations
- Short-term collaboration opportunities (0-12 months)
- Medium-term strategic initiatives (1-3 years)
- Long-term partnership vision (3-5 years)
- Risk factors and mitigation strategies

## Output Format
Provide the report in clean Markdown format with proper headers, bullet points, and sections. Include specific data points, statistics, and examples wherever possible."""
    
    def validate_output(self, content: str) -> bool:
        """Validate research output meets minimum requirements."""
        # Check minimum length (roughly 1500 words)
        if len(content) < 5000:
            return False
        
        # Check for required sections
        required_markers = [
            "company", "market", "technology", "opportunity", "recommendation"
        ]
        content_lower = content.lower()
        sections_found = sum(1 for marker in required_markers if marker in content_lower)
        
        return sections_found >= 3
