'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button, GlassCard, Logo, AgentIcon, FeatureIcon, Agent3DNetwork, Card3D } from '@/components/ui'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/solid'

export default function LandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a1a]">
            {/* Animated background */}
            <div className="fixed inset-0 -z-10">
                {/* Deep space gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0d1025] to-[#0a0a1a]" />

                {/* Aurora effects */}
                <div className="absolute top-0 left-0 w-full h-[600px] opacity-30">
                    <div className="absolute top-20 left-1/4 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute top-40 right-1/4 w-[600px] h-[300px] bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
                </div>

                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Floating orbs */}
                <motion.div
                    className="absolute top-1/3 left-10 w-2 h-2 bg-cyan-400/50 rounded-full"
                    animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-1/2 right-20 w-3 h-3 bg-purple-400/50 rounded-full"
                    animate={{ y: [0, 30, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                    className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-pink-400/50 rounded-full"
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-[#0a0a1a]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Logo size="md" animated={false} />
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Features</a>
                        <a href="#agents" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Agents</a>
                        <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">How it Works</a>
                    </div>

                    <Link href="/dashboard">
                        <Button size="sm">
                            Launch Dashboard
                            <ArrowRightIcon className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Text content */}
                        <div className="text-left">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm mb-8"
                            >
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                <span>Powered by Multi-Agent AI</span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h1
                                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <span className="text-white">Collaborative</span>
                                <br />
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                                    AI Intelligence
                                </span>
                            </motion.h1>

                            {/* Subheadline */}
                            <motion.p
                                className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                A sophisticated multi-agent AI system designed for collaborative intelligence
                                and automated business analysis. Research, analyze, and strategize — all in one platform.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                className="flex flex-col sm:flex-row items-start gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Link href="/dashboard">
                                    <Button size="lg" className="group">
                                        Get Started Free
                                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="#how-it-works">
                                    <Button variant="secondary" size="lg" className="gap-2">
                                        <PlayIcon className="w-5 h-5" />
                                        Watch Demo
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                className="flex gap-8 mt-12 pt-8 border-t border-white/10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {[
                                    { value: '6+', label: 'AI Agents' },
                                    { value: '100%', label: 'Automated' },
                                    { value: '10x', label: 'Faster Analysis' },
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                                        <div className="text-sm text-gray-500">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right side - 3D Agent Network */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            <Agent3DNetwork />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Enterprise-Grade Features
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Built for modern enterprises with scalability, security, and performance in mind.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: 'lightning' as const,
                                title: 'Real-Time Processing',
                                description: 'Asynchronous, non-blocking execution for lightning-fast processing and infinite scalability.',
                                color: '#F59E0B',
                            },
                            {
                                icon: 'cloud' as const,
                                title: 'Cloud-Native',
                                description: 'Containerized deployment with Azure Container Apps and fully automated CI/CD pipelines.',
                                color: '#3B82F6',
                            },
                            {
                                icon: 'shield' as const,
                                title: 'Enterprise Security',
                                description: 'API key management, role-based access control, and secure encrypted data handling.',
                                color: '#10B981',
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card3D glowColor={feature.color}>
                                    <div className="flex flex-col items-center text-center">
                                        <FeatureIcon type={feature.icon} size={56} />
                                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">{feature.title}</h3>
                                        <p className="text-gray-400">{feature.description}</p>
                                    </div>
                                </Card3D>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agents Section */}
            <section id="agents" className="py-24 px-6 relative">
                {/* Background accent */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Meet Your AI Agents
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Specialized AI agents working collaboratively to solve complex business challenges.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                type: 'research' as const,
                                name: 'Research Agent',
                                description: 'Deep market research, competitive analysis, and comprehensive data gathering',
                            },
                            {
                                type: 'product' as const,
                                name: 'Product Agent',
                                description: 'Product ideation, USP definition, and strategic feature planning',
                            },
                            {
                                type: 'marketing' as const,
                                name: 'Marketing Agent',
                                description: 'GTM strategy, regional insights, and sales positioning optimization',
                            },
                            {
                                type: 'critic' as const,
                                name: 'Critic Agent',
                                description: 'Quality assurance, validation, and actionable improvement suggestions',
                            },
                        ].map((agent, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="h-full"
                            >
                                <GlassCard className="h-full text-center group" variant="hover">
                                    <div className="flex flex-col items-center h-full min-h-[200px]">
                                        <AgentIcon type={agent.type} size={64} />
                                        <h3 className="text-lg font-semibold text-white mt-6 mb-2">{agent.name}</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed flex-1">{agent.description}</p>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Three simple steps to unlock the power of collaborative AI intelligence.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Select Your Company',
                                description: 'Choose or input your target company for comprehensive analysis.',
                                color: '#3B82F6',
                            },
                            {
                                step: '02',
                                title: 'AI Agents Collaborate',
                                description: 'Our specialized agents work together to research.and analyze.',
                                color: '#10B981',
                            },
                            {
                                step: '03',
                                title: 'Get Actionable Insights',
                                description: 'Receive detailed reports with strategic recommendations.',
                                color: '#A855F7',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="relative"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                            >
                                {/* Connector line */}
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-[2px] bg-gradient-to-r from-white/20 to-transparent" />
                                )}

                                <div className="text-center">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold"
                                        style={{
                                            background: `linear-gradient(135deg, ${item.color}30, ${item.color}10)`,
                                            border: `2px solid ${item.color}50`,
                                            color: item.color,
                                            boxShadow: `0 0 30px ${item.color}20`,
                                        }}
                                    >
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-400">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div
                            className="relative rounded-3xl p-12 text-center overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,58,237,0.1))',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            {/* Glow effect */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl" />
                                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl" />
                            </div>

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                >
                                    <AgentIcon type="orchestrator" size={80} className="mx-auto mb-8" />
                                </motion.div>

                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Ready to Transform Your Workflow?
                                </h2>
                                <p className="text-gray-400 mb-8 max-w-lg mx-auto text-lg">
                                    Start collaborating with AI agents today and unlock new possibilities for your business.
                                </p>
                                <Link href="/dashboard">
                                    <Button size="lg" className="group">
                                        Launch Dashboard
                                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/[0.05] py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <Logo size="sm" animated={false} />
                    <p className="text-sm text-gray-500">
                        © 2024 CollabGen. Collaborative Intelligence for Modern Enterprises.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Privacy</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Terms</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
