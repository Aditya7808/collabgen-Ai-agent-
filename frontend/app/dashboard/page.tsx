'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout'
import { GlassCard, Button, StatusPill } from '@/components/ui'
import { AgentCardGrid } from '@/components/agents'
import { useReports } from '@/hooks/useReports'
import { apiService, HealthResponse } from '@/lib/api'
import { formatExecutionTime } from '@/types/report'
import {
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
    ArrowRightIcon,
    SparklesIcon,
    ChartBarIcon,
    BoltIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
    const { reports, isLoading: reportsLoading } = useReports()
    const [health, setHealth] = useState<HealthResponse | null>(null)
    const [healthLoading, setHealthLoading] = useState(true)

    // Fetch health status
    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const healthData = await apiService.getHealth()
                setHealth(healthData)
            } catch (error) {
                console.error('Failed to fetch health:', error)
            } finally {
                setHealthLoading(false)
            }
        }
        fetchHealth()

        // Poll health every 30 seconds
        const interval = setInterval(fetchHealth, 30000)
        return () => clearInterval(interval)
    }, [])

    // Compute stats from real data
    const stats = [
        {
            label: 'Total Reports',
            value: reports?.total?.toString() || '0',
            change: 'All time',
            icon: DocumentTextIcon,
            color: '#10B981'
        },
        {
            label: 'Completed',
            value: reports?.reports?.filter(r => r.status === 'completed').length.toString() || '0',
            change: 'Successful runs',
            icon: BoltIcon,
            color: '#00D4FF'
        },
        {
            label: 'Partial',
            value: reports?.reports?.filter(r => r.status === 'partial').length.toString() || '0',
            change: 'Partial completions',
            icon: ChatBubbleLeftRightIcon,
            color: '#F59E0B'
        },
        {
            label: 'API Status',
            value: health?.status === 'healthy' ? '✓' : health?.status === 'degraded' ? '!' : '✗',
            change: health?.status || 'Unknown',
            icon: ClockIcon,
            color: health?.status === 'healthy' ? '#10B981' : health?.status === 'degraded' ? '#F59E0B' : '#EF4444'
        },
    ]

    // Get recent reports
    const recentReports = reports?.reports?.slice(0, 5).map(report => ({
        id: report.report_id,
        title: `${report.company_name} & ${report.partner_company}`,
        company: report.domain,
        date: new Date(report.created_at).toLocaleDateString(),
        time: formatExecutionTime(report.execution_time_ms),
        status: report.status as 'completed' | 'partial' | 'failed'
    })) || []

    // Health status items
    const systemStatus = [
        {
            name: 'LLM API',
            status: health?.checks?.llm_api === 'ok' ? 'Operational' : 'Error',
            color: health?.checks?.llm_api === 'ok' ? '#10B981' : '#EF4444'
        },
        {
            name: 'Storage',
            status: health?.checks?.storage === 'ok' ? 'Operational' : 'Error',
            color: health?.checks?.storage === 'ok' ? '#10B981' : '#EF4444'
        },
        {
            name: 'Memory',
            status: health?.checks?.memory === 'ok' ? 'Optimal' : health?.checks?.memory === 'warning' ? 'Warning' : 'Critical',
            color: health?.checks?.memory === 'ok' ? '#10B981' : health?.checks?.memory === 'warning' ? '#F59E0B' : '#EF4444'
        },
    ]

    return (
        <div className="min-h-screen">
            <Header
                title="Dashboard"
                subtitle="Welcome back! Here's what's happening with your agents."
            />

            <div className="p-6 space-y-8">
                {/* Stats Grid */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <GlassCard variant="hover">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted mb-1">{stat.label}</p>
                                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                                            <p className="text-sm mt-1 text-muted">
                                                {stat.change}
                                            </p>
                                        </div>
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: `${stat.color}15` }}
                                        >
                                            <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Agents Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Agent Status</h2>
                            <p className="text-sm text-muted">Monitor your AI agents in real-time</p>
                        </div>
                        <Link href="/dashboard/chat">
                            <Button variant="secondary" size="sm" rightIcon={<ArrowRightIcon className="w-4 h-4" />}>
                                Start Conversation
                            </Button>
                        </Link>
                    </div>
                    <AgentCardGrid />
                </section>

                {/* Two column layout */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent Reports */}
                    <div className="lg:col-span-2">
                        <GlassCard>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
                                    <p className="text-sm text-muted">Your latest generated reports</p>
                                </div>
                                <Link href="/dashboard/reports">
                                    <Button variant="ghost" size="sm">
                                        View All
                                    </Button>
                                </Link>
                            </div>

                            {reportsLoading ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : recentReports.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 text-center">
                                    <DocumentTextIcon className="w-10 h-10 text-muted mb-2" />
                                    <p className="text-muted">No reports yet</p>
                                    <Link href="/dashboard/chat" className="mt-2">
                                        <Button size="sm">Generate Your First Report</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentReports.map((report, index) => (
                                        <motion.div
                                            key={report.id}
                                            className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/10 flex items-center justify-center">
                                                <DocumentTextIcon className="w-5 h-5 text-neon-cyan" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/dashboard/reports/${report.id}`}>
                                                    <h4 className="font-medium text-white truncate group-hover:text-neon-cyan transition-colors">
                                                        {report.title}
                                                    </h4>
                                                </Link>
                                                <p className="text-sm text-muted">{report.company} • {report.time}</p>
                                            </div>
                                            <span className="text-xs text-muted hidden sm:block">{report.date}</span>
                                            <StatusPill status={report.status} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </GlassCard>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        {/* Quick Start */}
                        <GlassCard>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                                    <SparklesIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Quick Start</h3>
                                    <p className="text-xs text-muted">Run a new analysis</p>
                                </div>
                            </div>
                            <Link href="/dashboard/chat">
                                <Button className="w-full" rightIcon={<ArrowRightIcon className="w-4 h-4" />}>
                                    New Conversation
                                </Button>
                            </Link>
                        </GlassCard>

                        {/* Activity Chart Placeholder */}
                        <GlassCard>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-white">Activity</h3>
                                <ChartBarIcon className="w-5 h-5 text-muted" />
                            </div>
                            <div className="flex items-end justify-between gap-2 h-24">
                                {[40, 65, 45, 80, 55, 70, 90].map((height, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex-1 rounded-t-md bg-gradient-to-t from-neon-cyan/50 to-neon-cyan/20"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-muted">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>
                        </GlassCard>

                        {/* System Status */}
                        <GlassCard>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-white">System Status</h3>
                                {healthLoading && (
                                    <div className="w-4 h-4 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                                )}
                            </div>
                            <div className="space-y-3">
                                {systemStatus.map((service) => (
                                    <div key={service.name} className="flex items-center justify-between">
                                        <span className="text-sm text-muted">{service.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: service.color }} />
                                            <span className="text-xs text-white">{service.status}</span>
                                        </div>
                                    </div>
                                ))}
                                {health && (
                                    <div className="pt-2 border-t border-white/5 mt-3">
                                        <span className="text-xs text-muted">
                                            v{health.version} • Uptime: {Math.floor(health.uptime / 60)}m
                                        </span>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    )
}
