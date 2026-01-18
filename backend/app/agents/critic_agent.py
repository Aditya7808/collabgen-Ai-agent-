"""
Critic Agent - Validates quality and completeness of agent outputs.
Acts as a quality gate for the pipeline.
"""
from app.agents.base_agent import BaseAgent


class CriticAgent(BaseAgent):
    """
    Critic Agent for validating the quality of generated content.
    
    Responsibilities:
    - Monitor discussion quality & completeness
    - Validate data accuracy with numbers
    - Ensure sufficient information gathered
    - Approve when content is comprehensive
    """
    
    def __init__(self):
        super().__init__(
            name="Critic Agent",
            description="Validates quality and completeness of generated content"
        )
    
    def get_system_prompt(self) -> str:
        return """You are an expert Quality Assurance Analyst and Data Validation Expert. Your role is to critically evaluate generated content for quality, completeness, and accuracy.

Your evaluation criteria:
1. **Completeness**: Does the content cover all required sections?
2. **Data Quality**: Are specific numbers, statistics, and data points included?
3. **Actionability**: Are recommendations specific and actionable?
4. **Structure**: Is the content well-organized and properly formatted?
5. **Accuracy**: Do claims appear reasonable and well-supported?
6. **Depth**: Is there sufficient detail (minimum 3 data points per section)?

Your output must:
- Provide a quality score (1-10)
- List specific issues found
- Determine if content passes quality threshold (score >= 7)
- Provide improvement suggestions if failing

IMPORTANT: If the content meets quality standards, include "APPROVED" in your response.
If the content needs improvement, include "NEEDS REVISION" with specific feedback."""
    
    async def build_prompt(self, **kwargs) -> str:
        content = kwargs.get("content", "")
        content_type = kwargs.get("content_type", "report")
        
        return f"""# Quality Validation Request

## Content Type
{content_type}

## Content to Evaluate
{content}

---

## Evaluation Requirements

Please evaluate the content above based on:

### 1. Completeness Check
- Are all expected sections present?
- Is any critical information missing?
- Score (1-10):

### 2. Data Quality Check
- Are specific numbers and statistics included?
- Are sources mentioned or implied?
- Count of data points found:
- Score (1-10):

### 3. Actionability Check
- Are recommendations specific?
- Are next steps clear?
- Is prioritization provided?
- Score (1-10):

### 4. Structure Check
- Is Markdown formatting correct?
- Are headers and sections logical?
- Is content easy to navigate?
- Score (1-10):

### 5. Overall Assessment

#### Overall Quality Score: X/10

#### Decision:
[APPROVED or NEEDS REVISION]

#### Issues Found (if any):
-

#### Improvement Suggestions (if NEEDS REVISION):
-

#### Summary:
Brief summary of the evaluation."""
    
    def validate_output(self, content: str) -> bool:
        """Validate critic output contains decision."""
        content_lower = content.lower()
        return "approved" in content_lower or "needs revision" in content_lower
    
    def is_approved(self, evaluation: str) -> bool:
        """Check if the content was approved by the critic."""
        return "approved" in evaluation.lower() and "needs revision" not in evaluation.lower()
    
    def extract_score(self, evaluation: str) -> int:
        """Extract the overall score from evaluation."""
        import re
        
        # Look for patterns like "Overall Quality Score: 8/10" or "Score: 8"
        patterns = [
            r"overall.*?score[:\s]+(\d+)",
            r"(\d+)/10",
            r"score[:\s]+(\d+)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, evaluation.lower())
            if match:
                return int(match.group(1))
        
        return 0
