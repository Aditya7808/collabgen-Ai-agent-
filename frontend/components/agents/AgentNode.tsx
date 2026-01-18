'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AgentType, AgentStatus, AGENTS } from '@/types/agent'
import {
    MagnifyingGlassIcon,
    CubeIcon,
    MegaphoneIcon,
    EyeIcon,
    CircleStackIcon
} from '@heroicons/react/24/outline'

interface AgentNodeProps {
    agentType: AgentType
    status?: AgentStatus
    size?: 'sm' | 'md' | 'lg'
    showLabel?: boolean
    onClick?: () => void
    className?: string
}

const agentIcons: Record<AgentType, React.ReactNode> = {
    research: <MagnifyingGlassIcon className="w-6 h-6" />,
    product: <CubeIcon className="w-6 h-6" />,
    marketing: <MegaphoneIcon className="w-6 h-6" />,
    critic: <EyeIcon className="w-6 h-6" />,
    orchestrator: <CircleStackIcon className="w-6 h-6" />,
}

const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
}

export function AgentNode({
    agentType,
    status = 'idle',
    size = 'md',
    showLabel = true,
    onClick,
    className,
}: AgentNodeProps) {
    const agent = AGENTS[agentType]
    const isActive = status === 'running'
    const isCompleted = status === 'completed'

    return (
        <div
            className={cn(
                'flex flex-col items-center gap-2',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            <div className="relative">
                {/* Outer glow ring for active state */}
                {isActive && (
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: agent.color }}
                        initial={{ opacity: 0.3, scale: 1 }}
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                )}

                {/* Secondary pulse ring */}
                {isActive && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: agent.color }}
                        initial={{ opacity: 0.5, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                )}

                {/* Main node */}
                <motion.div
                    className={cn(
                        sizeClasses[size],
                        'relative flex items-center justify-center rounded-full',
                        'border-2 bg-space-50/80 backdrop-blur-xl',
                        'transition-all duration-300'
                    )}
                    style={{
                        borderColor: isActive || isCompleted ? agent.color : 'rgba(255,255,255,0.1)',
                        boxShadow: isActive
                            ? `0 0 30px ${agent.color}60, 0 0 60px ${agent.color}30`
                            : isCompleted
                                ? `0 0 20px ${agent.color}40`
                                : 'none',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div
                        className="transition-colors duration-300"
                        style={{ color: isActive || isCompleted ? agent.color : '#8B8B9E' }}
                    >
                        {agentIcons[agentType]}
                    </div>
                </motion.div>
            </div>

            {showLabel && (
                <div className="text-center">
                    <p
                        className="text-sm font-medium transition-colors duration-300"
                        style={{ color: isActive ? agent.color : 'white' }}
                    >
                        {agent.name.replace(' Agent', '')}
                    </p>
                    <p className="text-xs text-muted capitalize">{status}</p>
                </div>
            )}
        </div>
    )
}
