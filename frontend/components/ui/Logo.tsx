'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    showText?: boolean
    animated?: boolean
    className?: string
}

const sizeMap = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-3xl' },
}

export function Logo({ size = 'md', showText = true, animated = true, className = '' }: LogoProps) {
    const { icon: iconSize, text: textSize } = sizeMap[size]

    const LogoIcon = () => (
        <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
        >
            {/* Outer hexagon with gradient */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="50%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#00D4FF" />
                </linearGradient>
                <linearGradient id="innerGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E40AF" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background circle with glow */}
            <circle cx="24" cy="24" r="22" fill="url(#innerGradient)" opacity="0.9" />

            {/* Outer ring */}
            <circle
                cx="24"
                cy="24"
                r="21"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
            />

            {/* Neural network nodes */}
            <g filter="url(#glow)">
                {/* Center node */}
                <circle cx="24" cy="24" r="4" fill="#00D4FF" />

                {/* Outer nodes */}
                <circle cx="24" cy="12" r="3" fill="#00D4FF" />
                <circle cx="34" cy="19" r="3" fill="#A855F7" />
                <circle cx="34" cy="29" r="3" fill="#10B981" />
                <circle cx="24" cy="36" r="3" fill="#F97316" />
                <circle cx="14" cy="29" r="3" fill="#3B82F6" />
                <circle cx="14" cy="19" r="3" fill="#EC4899" />

                {/* Connection lines */}
                <line x1="24" y1="24" x2="24" y2="12" stroke="#00D4FF" strokeWidth="1.5" opacity="0.6" />
                <line x1="24" y1="24" x2="34" y2="19" stroke="#A855F7" strokeWidth="1.5" opacity="0.6" />
                <line x1="24" y1="24" x2="34" y2="29" stroke="#10B981" strokeWidth="1.5" opacity="0.6" />
                <line x1="24" y1="24" x2="24" y2="36" stroke="#F97316" strokeWidth="1.5" opacity="0.6" />
                <line x1="24" y1="24" x2="14" y2="29" stroke="#3B82F6" strokeWidth="1.5" opacity="0.6" />
                <line x1="24" y1="24" x2="14" y2="19" stroke="#EC4899" strokeWidth="1.5" opacity="0.6" />
            </g>
        </svg>
    )

    if (animated) {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                    <LogoIcon />
                </motion.div>
                {showText && (
                    <span className={`font-bold text-white ${textSize}`}>
                        CollabGen
                    </span>
                )}
            </div>
        )
    }

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <LogoIcon />
            {showText && (
                <span className={`font-bold text-white ${textSize}`}>
                    CollabGen
                </span>
            )}
        </div>
    )
}

// Compact logo for smaller spaces
export function LogoCompact({ size = 40, className = '' }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="compactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="20" fill="url(#compactGradient)" />
            <text x="24" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="system-ui">
                C
            </text>
        </svg>
    )
}

export default Logo
