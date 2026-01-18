'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/ui'
import { ReportListItem } from '@/types/report'
import { formatDate, truncateText } from '@/lib/utils'
import {
    DocumentTextIcon,
    ArrowDownTrayIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline'

interface ReportCardProps {
    report: ReportListItem
    onView?: () => void
    onDownload?: () => void
    onDelete?: () => void
    className?: string
}

export function ReportCard({
    report,
    onView,
    onDownload,
    onDelete,
    className,
}: ReportCardProps) {
    const statusColors = {
        generating: 'text-neon-amber',
        completed: 'text-neon-emerald',
        failed: 'text-red-500',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className={className}
        >
            <GlassCard className="h-full group" variant="hover" padding="none">
                {/* Header with gradient */}
                <div className="relative h-24 bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-transparent p-4">
                    <div className="absolute top-4 right-4">
                        <span
                            className={cn(
                                'text-xs font-medium capitalize px-2 py-1 rounded-full bg-white/5',
                                statusColors[report.status]
                            )}
                        >
                            {report.status}
                        </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <DocumentTextIcon className="w-5 h-5 text-neon-cyan" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 line-clamp-1">
                        {report.title}
                    </h3>
                    <p className="text-sm text-neon-cyan mb-2">{report.company}</p>
                    <p className="text-xs text-muted line-clamp-2 mb-4">
                        {truncateText(report.summary, 100)}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted">
                            {formatDate(report.createdAt)}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={onView}
                                className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-all"
                                title="View"
                            >
                                <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onDownload}
                                className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-all"
                                title="Download"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-2 rounded-lg hover:bg-red-500/20 text-muted hover:text-red-400 transition-all"
                                title="Delete"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    )
}

interface ReportListViewProps {
    report: ReportListItem
    onView?: () => void
    onDownload?: () => void
    onDelete?: () => void
    className?: string
}

export function ReportListView({
    report,
    onView,
    onDownload,
    onDelete,
    className,
}: ReportListViewProps) {
    const statusColors = {
        generating: 'bg-neon-amber',
        completed: 'bg-neon-emerald',
        failed: 'bg-red-500',
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={className}
        >
            <GlassCard className="group" variant="hover" padding="sm">
                <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/10 flex items-center justify-center flex-shrink-0">
                        <DocumentTextIcon className="w-5 h-5 text-neon-cyan" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-medium text-white truncate">{report.title}</h3>
                            <span
                                className={cn(
                                    'w-2 h-2 rounded-full',
                                    statusColors[report.status]
                                )}
                            />
                        </div>
                        <p className="text-sm text-muted truncate">
                            {report.company} • {report.summary}
                        </p>
                    </div>

                    {/* Date */}
                    <span className="text-sm text-muted flex-shrink-0 hidden sm:block">
                        {formatDate(report.createdAt)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={onView}
                            className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-all"
                        >
                            <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onDownload}
                            className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-all"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-muted hover:text-red-400 transition-all"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    )
}
