'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { AgentStatus } from '@/types/agent'

interface StatusBadgeProps {
    status: AgentStatus
    size?: 'sm' | 'md' | 'lg'
    showLabel?: boolean
    className?: string
}

const statusConfig = {
    idle: {
        color: 'bg-muted',
        label: 'Idle',
        glow: '',
    },
    pending: {
        color: 'bg-neon-amber',
        label: 'Pending',
        glow: 'shadow-[0_0_10px_rgba(245,158,11,0.4)]',
    },
    running: {
        color: 'bg-neon-emerald',
        label: 'Running',
        glow: 'shadow-[0_0_10px_rgba(16,185,129,0.6)]',
        animate: true,
    },
    completed: {
        color: 'bg-neon-cyan',
        label: 'Completed',
        glow: 'shadow-[0_0_10px_rgba(0,212,255,0.4)]',
    },
    error: {
        color: 'bg-red-500',
        label: 'Error',
        glow: 'shadow-[0_0_10px_rgba(239,68,68,0.4)]',
    },
}

export function StatusBadge({
    status,
    size = 'md',
    showLabel = false,
    className,
}: StatusBadgeProps) {
    const config = statusConfig[status]

    const sizeClasses = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <span
                className={cn(
                    'rounded-full',
                    sizeClasses[size],
                    config.color,
                    config.glow,
                    status === 'running' && 'animate-pulse'
                )}
            />
            {showLabel && (
                <span className="text-sm text-muted">{config.label}</span>
            )}
        </div>
    )
}

interface StatusPillProps {
    status: AgentStatus
    className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
    const config = statusConfig[status]

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium',
                'bg-white/5 border border-white/10',
                className
            )}
        >
            <span
                className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    config.color,
                    status === 'running' && 'animate-pulse'
                )}
            />
            <span className="text-white/80">{config.label}</span>
        </div>
    )
}
