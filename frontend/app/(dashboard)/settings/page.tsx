'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout'
import { GlassCard, Button, Input } from '@/components/ui'
import {
    UserCircleIcon,
    KeyIcon,
    BellIcon,
    PaintBrushIcon,
    CpuChipIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline'

const settingsSections = [
    {
        id: 'profile',
        title: 'Profile Settings',
        icon: UserCircleIcon,
        description: 'Manage your account details',
    },
    {
        id: 'api',
        title: 'API Configuration',
        icon: KeyIcon,
        description: 'Configure API keys and endpoints',
    },
    {
        id: 'notifications',
        title: 'Notifications',
        icon: BellIcon,
        description: 'Set your notification preferences',
    },
    {
        id: 'appearance',
        title: 'Appearance',
        icon: PaintBrushIcon,
        description: 'Customize the look and feel',
    },
    {
        id: 'agents',
        title: 'Agent Settings',
        icon: CpuChipIcon,
        description: 'Configure AI agent behavior',
    },
    {
        id: 'security',
        title: 'Security',
        icon: ShieldCheckIcon,
        description: 'Manage security settings',
    },
]

export default function SettingsPage() {
    return (
        <div className="min-h-screen">
            <Header
                title="Settings"
                subtitle="Configure your CollabGen experience"
            />

            <div className="p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Settings navigation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {settingsSections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <GlassCard
                                    className="cursor-pointer group"
                                    variant="hover"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors">
                                            <section.icon className="w-5 h-5 text-neon-cyan" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white group-hover:text-neon-cyan transition-colors">
                                                {section.title}
                                            </h3>
                                            <p className="text-sm text-muted">{section.description}</p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>

                    {/* API Configuration Example */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <GlassCard>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                                    <KeyIcon className="w-5 h-5 text-neon-purple" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">API Configuration</h2>
                                    <p className="text-sm text-muted">Configure your API keys and endpoints</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="OpenAI API Key"
                                    type="password"
                                    placeholder="sk-..."
                                    leftIcon={<KeyIcon className="w-4 h-4" />}
                                />
                                <Input
                                    label="Backend API URL"
                                    placeholder="http://localhost:8000"
                                />
                                <div className="flex items-center gap-3 pt-4">
                                    <Button variant="primary">Save Changes</Button>
                                    <Button variant="secondary">Test Connection</Button>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Agent Configuration */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                    >
                        <GlassCard>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-neon-emerald/10 flex items-center justify-center">
                                    <CpuChipIcon className="w-5 h-5 text-neon-emerald" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Agent Configuration</h2>
                                    <p className="text-sm text-muted">Configure AI agent behavior and parameters</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                    <div>
                                        <h4 className="font-medium text-white">Research Agent</h4>
                                        <p className="text-sm text-muted">Market research and data gathering</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                    <div>
                                        <h4 className="font-medium text-white">Product Agent</h4>
                                        <p className="text-sm text-muted">Product analysis and feature planning</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                    <div>
                                        <h4 className="font-medium text-white">Marketing Agent</h4>
                                        <p className="text-sm text-muted">Marketing strategy and insights</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                    <div>
                                        <h4 className="font-medium text-white">Critic Agent</h4>
                                        <p className="text-sm text-muted">Quality assurance and validation</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                                    </label>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
