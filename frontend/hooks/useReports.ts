'use client'

import { useState, useCallback, useEffect } from 'react'
import { apiService, ReportListResponse, ReportDetail } from '@/lib/api'

export interface UseReportsState {
    reports: ReportListResponse | null
    isLoading: boolean
    error: string | null
}

export interface UseReportsReturn extends UseReportsState {
    fetchReports: (page?: number, limit?: number) => Promise<void>
    getReport: (reportId: string) => Promise<ReportDetail | null>
    deleteReport: (reportId: string) => Promise<boolean>
    downloadReport: (reportId: string, filename?: string) => Promise<void>
    refresh: () => Promise<void>
}

export function useReports(autoFetch = true): UseReportsReturn {
    const [state, setState] = useState<UseReportsState>({
        reports: null,
        isLoading: false,
        error: null,
    })

    const fetchReports = useCallback(async (page = 1, limit = 20) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const response = await apiService.listReports(page, limit)
            setState({
                reports: response,
                isLoading: false,
                error: null,
            })
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to fetch reports'

            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }))
        }
    }, [])

    const getReport = useCallback(async (reportId: string): Promise<ReportDetail | null> => {
        try {
            return await apiService.getReport(reportId)
        } catch (err: unknown) {
            console.error('Failed to get report:', err)
            return null
        }
    }, [])

    const deleteReport = useCallback(async (reportId: string): Promise<boolean> => {
        try {
            await apiService.deleteReport(reportId)
            // Refresh the list after deletion
            await fetchReports()
            return true
        } catch (err: unknown) {
            console.error('Failed to delete report:', err)
            return false
        }
    }, [fetchReports])

    const downloadReport = useCallback(async (reportId: string, filename?: string) => {
        try {
            const blob = await apiService.downloadReport(reportId)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename || `report_${reportId}.md`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (err: unknown) {
            console.error('Failed to download report:', err)
        }
    }, [])

    const refresh = useCallback(async () => {
        await fetchReports()
    }, [fetchReports])

    // Auto-fetch on mount
    useEffect(() => {
        if (autoFetch) {
            fetchReports()
        }
    }, [autoFetch, fetchReports])

    return {
        ...state,
        fetchReports,
        getReport,
        deleteReport,
        downloadReport,
        refresh,
    }
}

export default useReports
