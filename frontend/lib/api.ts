import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Main API client for /api/v1 endpoints
export const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 300000, // 5 minutes for pipeline execution
})

// Root API client for non-prefixed endpoints (health, etc.)
export const rootApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add API key if available
        const apiKey = typeof window !== 'undefined' ? localStorage.getItem('api_key') : null
        if (apiKey) {
            config.headers['X-API-Key'] = apiKey
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

// API endpoints matching the backend
export const endpoints = {
    // Pipeline
    runPipeline: '/run-pipeline',

    // Individual Agents
    researchAgent: '/research-agent',
    productAgent: '/product-agent',
    marketingAgent: '/marketing-agent',

    // Reports
    listReports: '/reports',
    getReport: (id: string) => `/reports/${id}`,
    downloadReport: (id: string) => `/reports/${id}/download`,
    deleteReport: (id: string) => `/reports/${id}`,

    // Health (root level, not under /api/v1)
    health: '/health',
    healthLive: '/health/live',
    healthReady: '/health/ready',
}

// API Functions
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

export interface ReportSummary {
    report_id: string
    company_name: string
    partner_company: string
    domain: string
    status: 'completed' | 'partial' | 'failed'
    created_at: string
    execution_time_ms: number
}

export interface ReportDetail extends ReportSummary {
    content: string
    sections: PipelineSections
    tokens_used: number
}

export interface ReportListResponse {
    reports: ReportSummary[]
    total: number
    page: number
    limit: number
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

// API Service Functions
export const apiService = {
    // Run the full pipeline
    async runPipeline(request: PipelineRequest): Promise<PipelineResponse> {
        const response = await api.post<PipelineResponse>(endpoints.runPipeline, request)
        return response.data
    },

    // Run individual agents
    async runResearchAgent(request: { company_name: string; partner_company: string; domain: string }) {
        const response = await api.post(endpoints.researchAgent, request)
        return response.data
    },

    async runProductAgent(request: { research_report: string; company_name: string; domain: string }) {
        const response = await api.post(endpoints.productAgent, request)
        return response.data
    },

    async runMarketingAgent(request: {
        product_report: string;
        research_report: string;
        company_name: string;
        domain: string
    }) {
        const response = await api.post(endpoints.marketingAgent, request)
        return response.data
    },

    // Reports
    async listReports(page = 1, limit = 20, sort = 'created_at', order = 'desc'): Promise<ReportListResponse> {
        const response = await api.get<ReportListResponse>(endpoints.listReports, {
            params: { page, limit, sort, order }
        })
        return response.data
    },

    async getReport(reportId: string): Promise<ReportDetail> {
        const response = await api.get<ReportDetail>(endpoints.getReport(reportId))
        return response.data
    },

    async downloadReport(reportId: string): Promise<Blob> {
        const response = await api.get(endpoints.downloadReport(reportId), {
            responseType: 'blob'
        })
        return response.data
    },

    async deleteReport(reportId: string): Promise<void> {
        await api.delete(endpoints.deleteReport(reportId))
    },

    // Health - uses rootApi (not /api/v1 prefixed)
    async getHealth(): Promise<HealthResponse> {
        const response = await rootApi.get<HealthResponse>(endpoints.health)
        return response.data
    },

    async checkLive(): Promise<boolean> {
        try {
            await rootApi.get(endpoints.healthLive)
            return true
        } catch {
            return false
        }
    },

    async checkReady(): Promise<boolean> {
        try {
            await rootApi.get(endpoints.healthReady)
            return true
        } catch {
            return false
        }
    }
}

export default api
