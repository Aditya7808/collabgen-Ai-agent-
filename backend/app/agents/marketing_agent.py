"""
Marketing Agent - Creates go-to-market strategies and marketing plans.
Focuses on GTM strategy, regional insights, and sales positioning.
"""
from app.agents.base_agent import BaseAgent


class MarketingAgent(BaseAgent):
    """
    Marketing Agent for creating go-to-market strategies.
    
    Responsibilities:
    - GTM (Go-To-Market) strategy development
    - Regional insights and market positioning
    - Sales positioning and messaging
    - Marketing channel recommendations
    """
    
    def __init__(self):
        super().__init__(
            name="Marketing Agent",
            description="Creates GTM strategies, positioning, and marketing plans"
        )
    
    def get_system_prompt(self) -> str:
        return """You are an expert Marketing Strategist and Go-To-Market Specialist. Your role is to transform product concepts into comprehensive marketing strategies and launch plans.

Your expertise includes:
- Go-to-Market (GTM) strategy development
- Brand positioning and messaging
- Target audience segmentation
- Marketing channel strategy
- Content marketing and thought leadership
- Sales enablement and positioning
- Regional market adaptation
- Marketing metrics and ROI optimization

Your output must be:
- Strategic and actionable
- Grounded in the research and product data provided
- Include specific tactics with timelines
- Address multiple marketing channels
- Include budget considerations
- Minimum 1200 words with detailed tactical recommendations

Focus on strategies that:
1. Build awareness effectively
2. Generate qualified leads
3. Support sales processes
4. Create thought leadership
5. Measure and optimize performance"""
    
    async def build_prompt(self, **kwargs) -> str:
        product_report = kwargs.get("product_report", "")
        research_report = kwargs.get("research_report", "")
        company_name = kwargs.get("company_name", "")
        domain = kwargs.get("domain", "")
        
        return f"""# Marketing Strategy Request

## Context
Based on the research and product strategy provided below, create a comprehensive go-to-market strategy for the {domain} domain collaboration.

## Company Focus
**Primary Company**: {company_name}

## Research Insights
{research_report}

---

## Product Strategy
{product_report}

---

## Marketing Strategy Requirements

Please provide a comprehensive marketing strategy covering:

### 1. Executive Summary
- Overall marketing vision
- Key objectives and goals
- Success metrics overview

### 2. Target Audience Analysis

#### Primary Audience Segments
For each segment, define:
- Demographics and firmographics
- Psychographics and behaviors
- Pain points and motivations
- Decision-making process
- Preferred channels

#### Buyer Personas
- Detailed persona profiles
- Journey mapping
- Content preferences

### 3. Positioning & Messaging

#### Brand Positioning Statement
- Target audience
- Frame of reference
- Points of differentiation
- Reasons to believe

#### Key Messages
- Primary message (elevator pitch)
- Secondary messages (by audience)
- Proof points and evidence

#### Competitive Positioning
- Competitive landscape
- Differentiation strategy
- Counter-positioning tactics

### 4. Go-To-Market Strategy

#### Launch Plan
- Pre-launch activities (awareness building)
- Launch activities (announcement, events)
- Post-launch activities (sustaining momentum)

#### Channel Strategy
For each channel, provide:
- **Digital Marketing**
  - Website/landing pages
  - SEO/SEM strategy
  - Social media (platform-specific tactics)
  - Email marketing
  - Content marketing
  
- **Traditional Marketing**
  - Events and trade shows
  - PR and media relations
  - Print/OOH if relevant
  
- **Partner Marketing**
  - Co-marketing opportunities
  - Channel partner enablement
  - Referral programs

### 5. Content Strategy

#### Content Pillars
- Core themes and topics
- Content formats (blogs, videos, whitepapers, etc.)
- Content calendar framework

#### Thought Leadership
- Expert positioning
- Speaking opportunities
- Industry publications

### 6. Sales Enablement

#### Sales Collateral
- Pitch decks
- Battle cards
- Case studies/testimonials
- Demo scripts

#### Sales Training
- Product knowledge
- Objection handling
- Competitive intelligence

### 7. Regional Considerations
- Market-specific adaptations
- Localization requirements
- Regional channel preferences

### 8. Budget Framework
- Budget allocation by channel
- Expected ROI by activity
- Measurement approach

### 9. Timeline & Milestones
- 90-day launch plan
- Quarterly objectives
- Key milestones and checkpoints

### 10. KPIs & Measurement
- Marketing metrics dashboard
- Attribution model
- Reporting cadence

## Output Format
Provide the marketing strategy in clean Markdown format with proper headers, bullet points, tables where appropriate, and clear sections."""
    
    def validate_output(self, content: str) -> bool:
        """Validate marketing output meets minimum requirements."""
        # Check minimum length
        if len(content) < 4000:
            return False
        
        # Check for required sections
        required_markers = [
            "marketing", "audience", "channel", "content", "strategy", "launch"
        ]
        content_lower = content.lower()
        sections_found = sum(1 for marker in required_markers if marker in content_lower)
        
        return sections_found >= 4
