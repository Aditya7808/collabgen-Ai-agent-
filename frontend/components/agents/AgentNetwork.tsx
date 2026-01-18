'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AgentNode } from './AgentNode'
import { AgentType } from '@/types/agent'
import { useAgentStore } from '@/store'

interface AgentNetworkProps {
    className?: string
}

import { Agent } from '@/types/agent'

export function AgentNetwork({ className }: AgentNetworkProps) {
    const agents = useAgentStore((state: { agents: Record<AgentType, Agent> }) => state.agents)

    // Position agents in a circle around the orchestrator - increased spacing
    const agentPositions: { type: AgentType; x: number; y: number }[] = [
        { type: 'research', x: 0, y: -80 },
        { type: 'product', x: 80, y: 0 },
        { type: 'marketing', x: 0, y: 80 },
        { type: 'critic', x: -80, y: 0 },
    ]

    const getConnectionPath = (x: number, y: number) => {
        return `M 0 0 Q ${x / 2} ${y / 2} ${x} ${y}`
    }

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ minHeight: '240px' }}>
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="-120 -120 240 240"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Connection lines from orchestrator to agents */}
                {agentPositions.map((pos) => {
                    const agent = agents[pos.type]
                    const isActive = agent.status === 'running'
                    const isCompleted = agent.status === 'completed'

                    return (
                        <g key={pos.type}>
                            {/* Background line */}
                            <path
                                d={getConnectionPath(pos.x, pos.y)}
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="2"
                            />
                            {/* Animated line when active */}
                            {(isActive || isCompleted) && (
                                <motion.path
                                    d={getConnectionPath(pos.x, pos.y)}
                                    fill="none"
                                    stroke={agent.color}
                                    strokeWidth="2"
                                    strokeDasharray="8 4"
                                    initial={{ strokeDashoffset: 0 }}
                                    animate={{ strokeDashoffset: isActive ? -24 : 0 }}
                                    transition={{
                                        duration: 1,
                                        repeat: isActive ? Infinity : 0,
                                        ease: 'linear',
                                    }}
                                    style={{
                                        opacity: isActive ? 1 : 0.5,
                                    }}
                                />
                            )}
                            {/* Data flow particles */}
                            {isActive && (
                                <motion.circle
                                    r="3"
                                    fill={agent.color}
                                    initial={{ offsetDistance: '0%' }}
                                    animate={{ offsetDistance: '100%' }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                    style={{
                                        offsetPath: `path("${getConnectionPath(pos.x, pos.y)}")`,
                                    }}
                                />
                            )}
                        </g>
                    )
                })}
            </svg>

            {/* Orchestrator in center */}
            <div className="relative z-10">
                <AgentNode
                    agentType="orchestrator"
                    status={agents.orchestrator.status}
                    size="md"
                    showLabel={false}
                />
            </div>

            {/* Surrounding agents - now with labels hidden to prevent overlap */}
            {agentPositions.map((pos) => (
                <motion.div
                    key={pos.type}
                    className="absolute z-10"
                    style={{
                        transform: `translate(${pos.x}px, ${pos.y}px)`,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <AgentNode
                        agentType={pos.type}
                        status={agents[pos.type].status}
                        size="sm"
                        showLabel={false}
                    />
                </motion.div>
            ))}

            {/* Centered label for orchestrator */}
            <div className="absolute bottom-2 left-0 right-0 text-center z-20">
                <p className="text-xs font-medium text-white">Orchestrator</p>
                <p className="text-[10px] text-muted capitalize">{agents.orchestrator.status}</p>
            </div>
        </div>
    )
}
