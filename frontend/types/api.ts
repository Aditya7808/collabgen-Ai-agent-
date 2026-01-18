// API Request/Response types matching backend

export type AgentType = 'research' | 'product' | 'marketing' | 'orchestrator'
export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'skipped'

export interface PipelineRequest {
    company_name: string
    partner_company: string
    domain: string
}

export interface SectionStatus {
    status: 'completed' | 'failed' | 'skipped'
    content: string
    error: string | null
}

export interface PipelineSections {
    research: SectionStatus
    product: SectionStatus
    marketing: SectionStatus
}

export interface PipelineMetadata {
    created_at: string
    execution_time_ms: number
    tokens_used: number
}

export interface PipelineResponse {
    report_id: string
    status: 'completed' | 'partial' | 'failed'
    content: string
    sections: PipelineSections
    metadata: PipelineMetadata
}

export interface AgentResponse {
    status: 'success' | 'error'
    content: string
    agent_name: string
    execution_time_ms: number
    error_message?: string
}

export interface HealthCheck {
    llm_api: 'ok' | 'error'
    storage: 'ok' | 'error'
    memory: 'ok' | 'warning' | 'critical'
}

export interface HealthResponse {
    status: 'healthy' | 'degraded' | 'unhealthy'
    version: string
    uptime: number
    checks: HealthCheck
}

export interface ApiError {
    error: string
    message: string
    details?: Record<string, unknown>
    timestamp: string
    request_id: string
}

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: Date
    agentType?: AgentType
    isStreaming?: boolean
}

// Available domains from backend
export const AVAILABLE_DOMAINS = [
    'XR',
    'AI',
    'Robotics',
    'Healthcare',
    'Finance',
    'Gaming',
    'Education',
    'Automotive',
    'Retail',
    'Manufacturing'
] as const

export type Domain = typeof AVAILABLE_DOMAINS[number]
