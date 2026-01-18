// Report types matching backend responses

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

export interface Report {
    report_id: string
    company_name: string
    partner_company: string
    domain: string
    status: 'completed' | 'partial' | 'failed'
    content: string
    sections: PipelineSections
    created_at: string
    execution_time_ms: number
    tokens_used: number
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

export interface ReportListResponse {
    reports: ReportSummary[]
    total: number
    page: number
    limit: number
}

// Utility functions
export function getReportTitle(report: ReportSummary | Report): string {
    return `${report.company_name} & ${report.partner_company}`
}

export function formatExecutionTime(ms: number): string {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    const seconds = ms / 1000
    if (seconds < 60) return `${seconds.toFixed(1)}s`
    const minutes = seconds / 60
    return `${minutes.toFixed(1)}m`
}

export function getStatusColor(status: Report['status']): string {
    switch (status) {
        case 'completed': return 'text-green-500'
        case 'partial': return 'text-yellow-500'
        case 'failed': return 'text-red-500'
        default: return 'text-gray-500'
    }
}

export function getStatusBadge(status: Report['status']): { label: string; variant: 'success' | 'warning' | 'error' } {
    switch (status) {
        case 'completed': return { label: 'Completed', variant: 'success' }
        case 'partial': return { label: 'Partial', variant: 'warning' }
        case 'failed': return { label: 'Failed', variant: 'error' }
    }
}
