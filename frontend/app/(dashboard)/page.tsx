'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout'
import { GlassCard, Button, StatusPill } from '@/components/ui'
import { AgentCardGrid } from '@/components/agents'
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

const stats = [
    { label: 'Pipelines Run', value: '24', change: '+12%', icon: BoltIcon, color: '#00D4FF' },
    { label: 'Reports Generated', value: '18', change: '+8%', icon: DocumentTextIcon, color: '#10B981' },
    { label: 'Conversations', value: '42', change: '+24%', icon: ChatBubbleLeftRightIcon, color: '#A855F7' },
    { label: 'Avg. Response Time', value: '2.4s', change: '-15%', icon: ClockIcon, color: '#F59E0B' },
]

const recentReports = [
    { id: '1', title: 'Apple XR Market Analysis', company: 'Apple Inc.', date: '2 hours ago', status: 'completed' as const },
    { id: '2', title: 'Meta VR Product Strategy', company: 'Meta Platforms', date: '5 hours ago', status: 'completed' as const },
    { id: '3', title: 'Microsoft Mixed Reality', company: 'Microsoft', date: '1 day ago', status: 'completed' as const },
]

export default function DashboardPage() {
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
                                            <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-neon-emerald' : 'text-neon-cyan'}`}>
                                                {stat.change} from last week
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
                                            <h4 className="font-medium text-white truncate group-hover:text-neon-cyan transition-colors">
                                                {report.title}
                                            </h4>
                                            <p className="text-sm text-muted">{report.company}</p>
                                        </div>
                                        <span className="text-xs text-muted hidden sm:block">{report.date}</span>
                                        <StatusPill status={report.status} />
                                    </motion.div>
                                ))}
                            </div>
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
                            <h3 className="font-semibold text-white mb-4">System Status</h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'API Server', status: 'Operational', color: '#10B981' },
                                    { name: 'LLM Service', status: 'Operational', color: '#10B981' },
                                    { name: 'Storage', status: 'Operational', color: '#10B981' },
                                ].map((service) => (
                                    <div key={service.name} className="flex items-center justify-between">
                                        <span className="text-sm text-muted">{service.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: service.color }} />
                                            <span className="text-xs text-white">{service.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    )
}
