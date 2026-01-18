'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    variant?: 'default' | 'hover' | 'glow'
    glowColor?: 'cyan' | 'purple' | 'emerald' | 'amber'
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function GlassCard({
    children,
    className,
    variant = 'default',
    glowColor,
    padding = 'md',
    ...props
}: GlassCardProps) {
    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-8',
    }

    const glowClasses = {
        cyan: 'hover:shadow-glow-md',
        purple: 'hover:shadow-glow-purple',
        emerald: 'hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)]',
        amber: 'hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.4)]',
    }

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl',
                'shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]',
                paddingClasses[padding],
                variant === 'hover' && 'transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-0.5',
                variant === 'glow' && glowColor && glowClasses[glowColor],
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
