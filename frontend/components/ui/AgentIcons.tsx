'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AgentIconProps {
    type: 'research' | 'product' | 'marketing' | 'critic' | 'orchestrator'
    size?: number
    animated?: boolean
    className?: string
}

const agentColors = {
    research: { primary: '#3B82F6', secondary: '#1E40AF', glow: 'rgba(59, 130, 246, 0.4)' },
    product: { primary: '#10B981', secondary: '#047857', glow: 'rgba(16, 185, 129, 0.4)' },
    marketing: { primary: '#F97316', secondary: '#C2410C', glow: 'rgba(249, 115, 22, 0.4)' },
    critic: { primary: '#A855F7', secondary: '#7C3AED', glow: 'rgba(168, 85, 247, 0.4)' },
    orchestrator: { primary: '#00D4FF', secondary: '#0EA5E9', glow: 'rgba(0, 212, 255, 0.4)' },
}

export function AgentIcon({ type, size = 48, animated = true, className = '' }: AgentIconProps) {
    const colors = agentColors[type]

    const IconContent = () => {
        switch (type) {
            case 'research':
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="researchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={colors.primary} />
                                <stop offset="100%" stopColor={colors.secondary} />
                            </linearGradient>
                            <filter id="researchGlow">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        <circle cx="24" cy="24" r="22" fill="url(#researchGrad)" opacity="0.15" />
                        <circle cx="24" cy="24" r="20" stroke={colors.primary} strokeWidth="1.5" fill="none" opacity="0.3" />
                        <g filter="url(#researchGlow)">
                            {/* Magnifying glass */}
                            <circle cx="22" cy="20" r="8" stroke="white" strokeWidth="2.5" fill="none" />
                            <line x1="28" y1="26" x2="34" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            {/* Data dots */}
                            <circle cx="20" cy="18" r="1.5" fill="white" opacity="0.8" />
                            <circle cx="24" cy="20" r="1.5" fill="white" opacity="0.8" />
                            <circle cx="22" cy="23" r="1.5" fill="white" opacity="0.8" />
                        </g>
                    </svg>
                )

            case 'product':
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="productGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={colors.primary} />
                                <stop offset="100%" stopColor={colors.secondary} />
                            </linearGradient>
                            <filter id="productGlow">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        <circle cx="24" cy="24" r="22" fill="url(#productGrad)" opacity="0.15" />
                        <circle cx="24" cy="24" r="20" stroke={colors.primary} strokeWidth="1.5" fill="none" opacity="0.3" />
                        <g filter="url(#productGlow)">
                            {/* 3D Cube */}
                            <path d="M24 12L36 19V33L24 40L12 33V19L24 12Z" stroke="white" strokeWidth="2" fill="none" />
                            <path d="M24 12V26M24 26L12 19M24 26L36 19" stroke="white" strokeWidth="2" fill="none" />
                            <path d="M24 26V40" stroke="white" strokeWidth="2" opacity="0.6" />
                        </g>
                    </svg>
                )

            case 'marketing':
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="marketingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={colors.primary} />
                                <stop offset="100%" stopColor={colors.secondary} />
                            </linearGradient>
                            <filter id="marketingGlow">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        <circle cx="24" cy="24" r="22" fill="url(#marketingGrad)" opacity="0.15" />
                        <circle cx="24" cy="24" r="20" stroke={colors.primary} strokeWidth="1.5" fill="none" opacity="0.3" />
                        <g filter="url(#marketingGlow)">
                            {/* Megaphone/Growth chart hybrid */}
                            <path d="M14 22L14 30L18 28L18 24L14 22Z" fill="white" />
                            <path d="M18 20L34 14L34 34L18 28L18 20Z" stroke="white" strokeWidth="2" fill="none" />
                            {/* Signal waves */}
                            <path d="M36 20C38 22 38 26 36 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                            <path d="M38 17C41 20 41 28 38 31" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
                        </g>
                    </svg>
                )

            case 'critic':
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="criticGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={colors.primary} />
                                <stop offset="100%" stopColor={colors.secondary} />
                            </linearGradient>
                            <filter id="criticGlow">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        <circle cx="24" cy="24" r="22" fill="url(#criticGrad)" opacity="0.15" />
                        <circle cx="24" cy="24" r="20" stroke={colors.primary} strokeWidth="1.5" fill="none" opacity="0.3" />
                        <g filter="url(#criticGlow)">
                            {/* Eye with analysis */}
                            <ellipse cx="24" cy="24" rx="12" ry="8" stroke="white" strokeWidth="2" fill="none" />
                            <circle cx="24" cy="24" r="4" fill="white" />
                            <circle cx="24" cy="24" r="2" fill={colors.primary} />
                            {/* Scan lines */}
                            <line x1="11" y1="18" x2="15" y2="20" stroke="white" strokeWidth="1.5" opacity="0.6" />
                            <line x1="11" y1="30" x2="15" y2="28" stroke="white" strokeWidth="1.5" opacity="0.6" />
                            <line x1="37" y1="18" x2="33" y2="20" stroke="white" strokeWidth="1.5" opacity="0.6" />
                            <line x1="37" y1="30" x2="33" y2="28" stroke="white" strokeWidth="1.5" opacity="0.6" />
                        </g>
                    </svg>
                )

            case 'orchestrator':
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="orchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={colors.primary} />
                                <stop offset="100%" stopColor="#7C3AED" />
                            </linearGradient>
                            <filter id="orchGlow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        <circle cx="24" cy="24" r="22" fill="url(#orchGrad)" opacity="0.2" />
                        <circle cx="24" cy="24" r="20" stroke="url(#orchGrad)" strokeWidth="1.5" fill="none" />
                        <g filter="url(#orchGlow)">
                            {/* Central hub */}
                            <circle cx="24" cy="24" r="6" fill="white" />
                            {/* Orbital nodes */}
                            <circle cx="24" cy="10" r="3" fill="#3B82F6" />
                            <circle cx="36" cy="18" r="3" fill="#10B981" />
                            <circle cx="36" cy="30" r="3" fill="#F97316" />
                            <circle cx="24" cy="38" r="3" fill="#A855F7" />
                            <circle cx="12" cy="30" r="3" fill="#EC4899" />
                            <circle cx="12" cy="18" r="3" fill="#06B6D4" />
                            {/* Connection lines */}
                            <line x1="24" y1="18" x2="24" y2="10" stroke="white" strokeWidth="1" opacity="0.5" />
                            <line x1="29" y1="21" x2="36" y2="18" stroke="white" strokeWidth="1" opacity="0.5" />
                            <line x1="29" y1="27" x2="36" y2="30" stroke="white" strokeWidth="1" opacity="0.5" />
                            <line x1="24" y1="30" x2="24" y2="38" stroke="white" strokeWidth="1" opacity="0.5" />
                            <line x1="19" y1="27" x2="12" y2="30" stroke="white" strokeWidth="1" opacity="0.5" />
                            <line x1="19" y1="21" x2="12" y2="18" stroke="white" strokeWidth="1" opacity="0.5" />
                        </g>
                    </svg>
                )

            default:
                return null
        }
    }

    if (animated) {
        return (
            <motion.div
                className={className}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ filter: `drop-shadow(0 0 12px ${colors.glow})` }}
            >
                <IconContent />
            </motion.div>
        )
    }

    return (
        <div className={className} style={{ filter: `drop-shadow(0 0 12px ${colors.glow})` }}>
            <IconContent />
        </div>
    )
}

// Feature icons
export function FeatureIcon({ type, size = 48 }: { type: 'lightning' | 'cloud' | 'shield'; size?: number }) {
    const colors = {
        lightning: { primary: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)' },
        cloud: { primary: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)' },
        shield: { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' },
    }
    const color = colors[type]

    const IconContent = () => {
        switch (type) {
            case 'lightning':
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="20" fill={color.primary} opacity="0.15" />
                        <path d="M26 10L14 26H22L20 38L34 22H26L28 10H26Z" fill={color.primary} />
                    </svg>
                )
            case 'cloud':
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="20" fill={color.primary} opacity="0.15" />
                        <path d="M36 30C38.2091 30 40 28.2091 40 26C40 23.7909 38.2091 22 36 22C36 18 32 14 27 14C22 14 18 18 18 22C18 22 18 22 18 22C14 22 10 25 10 30C10 34 14 36 18 36H36C38 36 40 34 40 32" stroke={color.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <circle cx="24" cy="28" r="2" fill={color.primary} />
                        <path d="M24 32V36" stroke={color.primary} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                )
            case 'shield':
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="20" fill={color.primary} opacity="0.15" />
                        <path d="M24 8L10 14V24C10 32 16 38 24 42C32 38 38 32 38 24V14L24 8Z" stroke={color.primary} strokeWidth="2.5" fill="none" />
                        <path d="M18 24L22 28L30 20" stroke={color.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
        }
    }

    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            style={{ filter: `drop-shadow(0 0 10px ${color.glow})` }}
        >
            <IconContent />
        </motion.div>
    )
}

export default AgentIcon
