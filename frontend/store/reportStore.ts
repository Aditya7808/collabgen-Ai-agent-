import { create } from 'zustand'
import { Report, ReportListItem } from '@/types/report'

interface ReportState {
    reports: ReportListItem[]
    selectedReport: Report | null
    isLoading: boolean
    viewMode: 'grid' | 'list'

    // Actions
    setReports: (reports: ReportListItem[]) => void
    addReport: (report: ReportListItem) => void
    removeReport: (id: string) => void
    setSelectedReport: (report: Report | null) => void
    setLoading: (isLoading: boolean) => void
    setViewMode: (mode: 'grid' | 'list') => void
    reset: () => void
}

export const useReportStore = create<ReportState>((set) => ({
    reports: [],
    selectedReport: null,
    isLoading: false,
    viewMode: 'grid',

    setReports: (reports: ReportListItem[]) => set({ reports }),

    addReport: (report: ReportListItem) =>
        set((state: ReportState) => ({
            reports: [report, ...state.reports],
        })),

    removeReport: (id: string) =>
        set((state: ReportState) => ({
            reports: state.reports.filter((r: ReportListItem) => r.id !== id),
        })),

    setSelectedReport: (report: Report | null) => set({ selectedReport: report }),

    setLoading: (isLoading: boolean) => set({ isLoading }),

    setViewMode: (mode: 'grid' | 'list') => set({ viewMode: mode }),

    reset: () =>
        set({
            reports: [],
            selectedReport: null,
            isLoading: false,
            viewMode: 'grid',
        }),
}))
