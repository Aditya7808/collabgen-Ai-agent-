'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui'
import { AgentType, AGENTS } from '@/types/agent'
import { useAgentStore } from '@/store'
import {
    MagnifyingGlassIcon,
    CubeIcon,
    MegaphoneIcon,
    EyeIcon
} from '@heroicons/react/24/outline'

interface AgentCardProps {
    agentType: AgentType
    className?: string
}

const agentIcons: Record<AgentType, React.ReactNode> = {
    research: <MagnifyingGlassIcon className="w-8 h-8" />,
    product: <CubeIcon className="w-8 h-8" />,
    marketing: <MegaphoneIcon className="w-8 h-8" />,
    critic: <EyeIcon className="w-8 h-8" />,
    orchestrator: null,
}

export function AgentCard({ agentType, className }: AgentCardProps) {
    const agent = useAgentStore((state: { agents: Record<AgentType, { status: string; color: string }> }) => state.agents[agentType])
    const baseAgent = AGENTS[agentType]
    const isActive = agent.status === 'running'
    const isCompleted = agent.status === 'completed'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={className}
        >
            <GlassCard
                className="relative overflow-hidden group"
                variant="hover"
            >
                {/* Animated background gradient when active */}
                {isActive && (
                    <motion.div
                        className="absolute inset-0 opacity-20"
                        style={{
                            background: `radial-gradient(circle at 50% 50%, ${baseAgent.color}40, transparent 70%)`,
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.3, 0.2],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                )}

                {/* Top accent line */}
                <div
                    className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${baseAgent.color}, transparent)`,
                        opacity: isActive || isCompleted ? 1 : 0.3,
                    }}
                />

                <div className="relative z-10 p-6">
                    <div className="flex items-start justify-between mb-4">
                        {/* Icon */}
                        <div
                            className="p-3 rounded-xl transition-all duration-300"
                            style={{
                                backgroundColor: `${baseAgent.color}15`,
                                color: isActive || isCompleted ? baseAgent.color : '#8B8B9E',
                                boxShadow: isActive ? `0 0 20px ${baseAgent.color}30` : 'none',
                            }}
                        >
                            {agentIcons[agentType]}
                        </div>

                        {/* Status indicator */}
                        <div className="flex items-center gap-2">
                            <span
                                className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : ''
                                    }`}
                                style={{
                                    backgroundColor: isActive
                                        ? baseAgent.color
                                        : isCompleted
                                            ? '#10B981'
                                            : '#8B8B9E',
                                    boxShadow: isActive ? `0 0 10px ${baseAgent.color}` : 'none',
                                }}
                            />
                            <span className="text-xs text-muted capitalize">{agent.status}</span>
                        </div>
                    </div>

                    {/* Name and description */}
                    <h3 className="text-lg font-semibold text-white mb-2">
                        {baseAgent.name}
                    </h3>
                    <p className="text-sm text-muted line-clamp-2">
                        {baseAgent.description}
                    </p>

                    {/* Progress bar when running */}
                    {isActive && (
                        <div className="mt-4">
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: baseAgent.color }}
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </GlassCard>
        </motion.div>
    )
}

export function AgentCardGrid() {
    const agentTypes: AgentType[] = ['research', 'product', 'marketing', 'critic']

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentTypes.map((type, index) => (
                <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <AgentCard agentType={type} />
                </motion.div>
            ))}
        </div>
    )
}
