"""
Application configuration with environment variable validation.
Uses Pydantic Settings for type-safe configuration management.
"""
from functools import lru_cache
from typing import List, Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "CollabGen-Agent"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = Field(default="development", pattern="^(development|staging|production)$")
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # API Keys
    OPENAI_API_KEY: str = Field(..., description="OpenAI API key for GPT-4")
    OPENAI_MODEL: str = Field(default="gpt-4-turbo-preview", description="OpenAI model to use")
    API_KEY_SECRET: str = Field(default="collabgen-secret-key", description="Secret for hashing API keys")
    
    # Valid API Keys (comma-separated in env)
    VALID_API_KEYS: str = Field(default="", description="Comma-separated list of valid API keys")
    
    # Rate Limiting
    RATE_LIMIT_PIPELINE: str = "5/hour"
    RATE_LIMIT_AGENTS: str = "10/hour"
    RATE_LIMIT_REPORTS: str = "100/hour"
    
    # Timeouts (in seconds)
    TIMEOUT_RESEARCH_AGENT: int = 120
    TIMEOUT_PRODUCT_AGENT: int = 90
    TIMEOUT_MARKETING_AGENT: int = 90
    TIMEOUT_PIPELINE: int = 300
    TIMEOUT_LLM_REQUEST: int = 60
    
    # Retry Configuration
    MAX_RETRIES: int = 3
    RETRY_INITIAL_DELAY: float = 1.0
    RETRY_MAX_DELAY: float = 30.0
    RETRY_BACKOFF_FACTOR: int = 2
    
    # Circuit Breaker
    CIRCUIT_BREAKER_FAILURE_THRESHOLD: int = 5
    CIRCUIT_BREAKER_RECOVERY_TIMEOUT: int = 60
    
    # Storage
    REPORTS_DIRECTORY: str = "./reports"
    MAX_REQUEST_SIZE_MB: int = 10
    MAX_MARKDOWN_LENGTH: int = 1048576  # 1 MB
    
    # CORS
    CORS_ORIGINS: str = Field(default="http://localhost:3000", description="Comma-separated allowed origins")
    
    # Domain Whitelist
    ALLOWED_DOMAINS: str = "XR,AI,Robotics,Healthcare,Finance,Gaming,Education,Automotive,Retail,Manufacturing"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"  # json or console
    
    @field_validator("VALID_API_KEYS", mode="before")
    @classmethod
    def parse_api_keys(cls, v: str) -> str:
        return v.strip() if v else ""
    
    @property
    def valid_api_keys_list(self) -> List[str]:
        """Get list of valid API keys."""
        if not self.VALID_API_KEYS:
            return []
        return [k.strip() for k in self.VALID_API_KEYS.split(",") if k.strip()]
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Get list of CORS origins."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
    
    @property
    def allowed_domains_list(self) -> List[str]:
        """Get list of allowed domains."""
        return [d.strip() for d in self.ALLOWED_DOMAINS.split(",") if d.strip()]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
