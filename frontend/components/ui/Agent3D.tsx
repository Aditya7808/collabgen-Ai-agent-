'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface Agent3DProps {
    className?: string
}

const agents = [
    { id: 'research', name: 'Research', letter: 'R', color: '#3B82F6', angle: 0 },
    { id: 'product', name: 'Product', letter: 'P', color: '#10B981', angle: 60 },
    { id: 'marketing', name: 'Marketing', letter: 'M', color: '#F97316', angle: 120 },
    { id: 'critic', name: 'Critic', letter: 'C', color: '#A855F7', angle: 180 },
    { id: 'analyst', name: 'Analyst', letter: 'A', color: '#EC4899', angle: 240 },
    { id: 'strategy', name: 'Strategy', letter: 'S', color: '#06B6D4', angle: 300 },
]

export function Agent3DNetwork({ className = '' }: Agent3DProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), { stiffness: 100, damping: 30 })
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), { stiffness: 100, damping: 30 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        mouseX.set(e.clientX - centerX)
        mouseY.set(e.clientY - centerY)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
        setIsHovered(false)
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-[500px] ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1200px' }}
        >
            {/* Ambient glow background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 bg-gradient-radial from-neon-cyan/20 via-neon-purple/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
            </div>

            <motion.div
                className="relative w-full h-full flex items-center justify-center"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Central Orchestrator Hub */}
                <motion.div
                    className="absolute z-20"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{
                        rotateY: isHovered ? 0 : [0, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <div
                        className="relative w-28 h-28 rounded-full flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(124, 58, 237, 0.3))',
                            boxShadow: '0 0 60px rgba(0, 212, 255, 0.5), inset 0 0 30px rgba(255,255,255,0.1)',
                            border: '2px solid rgba(0, 212, 255, 0.5)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {/* Inner core */}
                        <motion.div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                                boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)',
                            }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <circle cx="16" cy="16" r="4" fill="white" />
                                <circle cx="16" cy="6" r="2" fill="white" opacity="0.8" />
                                <circle cx="24" cy="12" r="2" fill="white" opacity="0.8" />
                                <circle cx="24" cy="20" r="2" fill="white" opacity="0.8" />
                                <circle cx="16" cy="26" r="2" fill="white" opacity="0.8" />
                                <circle cx="8" cy="20" r="2" fill="white" opacity="0.8" />
                                <circle cx="8" cy="12" r="2" fill="white" opacity="0.8" />
                                <line x1="16" y1="12" x2="16" y2="6" stroke="white" strokeWidth="1" opacity="0.5" />
                                <line x1="19" y1="14" x2="24" y2="12" stroke="white" strokeWidth="1" opacity="0.5" />
                                <line x1="19" y1="18" x2="24" y2="20" stroke="white" strokeWidth="1" opacity="0.5" />
                                <line x1="16" y1="20" x2="16" y2="26" stroke="white" strokeWidth="1" opacity="0.5" />
                                <line x1="13" y1="18" x2="8" y2="20" stroke="white" strokeWidth="1" opacity="0.5" />
                                <line x1="13" y1="14" x2="8" y2="12" stroke="white" strokeWidth="1" opacity="0.5" />
                            </svg>
                        </motion.div>

                        {/* Orbiting ring */}
                        <motion.div
                            className="absolute inset-0 rounded-full border border-white/20"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        />
                    </div>
                </motion.div>

                {/* Agent Nodes in 3D Orbit */}
                {agents.map((agent, index) => {
                    const radius = 160
                    const angleRad = (agent.angle * Math.PI) / 180
                    const x = Math.cos(angleRad) * radius
                    const z = Math.sin(angleRad) * radius * 0.5
                    const y = Math.sin(angleRad) * 30

                    return (
                        <motion.div
                            key={agent.id}
                            className="absolute"
                            style={{
                                transformStyle: 'preserve-3d',
                                transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            {/* Connection beam */}
                            <svg
                                className="absolute pointer-events-none"
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    left: '-100px',
                                    top: '-100px',
                                    transform: 'translateZ(-1px)',
                                }}
                            >
                                <defs>
                                    <linearGradient id={`beam-${agent.id}`} x1="50%" y1="50%" x2="100%" y2="50%">
                                        <stop offset="0%" stopColor={agent.color} stopOpacity="0.8" />
                                        <stop offset="100%" stopColor={agent.color} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <motion.line
                                    x1="100"
                                    y1="100"
                                    x2={100 - x * 0.6}
                                    y2={100 - y * 0.6}
                                    stroke={`url(#beam-${agent.id})`}
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                                />
                            </svg>

                            {/* Agent Node */}
                            <motion.div
                                className="relative group cursor-pointer"
                                whileHover={{ scale: 1.2, z: 50 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                                    style={{
                                        background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}20)`,
                                        border: `2px solid ${agent.color}`,
                                        boxShadow: `0 0 30px ${agent.color}50, inset 0 0 20px ${agent.color}20`,
                                        backdropFilter: 'blur(10px)',
                                    }}
                                >
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: agent.color, textShadow: `0 0 10px ${agent.color}` }}
                                    >
                                        {agent.letter}
                                    </span>

                                    {/* Pulse ring */}
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl"
                                        style={{ border: `1px solid ${agent.color}` }}
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                                    />
                                </div>

                                {/* Label */}
                                <motion.div
                                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                >
                                    <span
                                        className="text-sm font-medium px-3 py-1 rounded-full"
                                        style={{
                                            background: `${agent.color}20`,
                                            color: agent.color,
                                            border: `1px solid ${agent.color}40`,
                                        }}
                                    >
                                        {agent.name} Agent
                                    </span>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )
                })}

                {/* Floating particles - using fixed positions to avoid hydration mismatch */}
                {[
                    { left: 5, top: 10, duration: 3, delay: 0 },
                    { left: 15, top: 80, duration: 4, delay: 0.5 },
                    { left: 25, top: 30, duration: 3.5, delay: 1 },
                    { left: 35, top: 60, duration: 2.5, delay: 0.3 },
                    { left: 45, top: 15, duration: 3, delay: 0.8 },
                    { left: 55, top: 75, duration: 4, delay: 1.2 },
                    { left: 65, top: 40, duration: 3.2, delay: 0.6 },
                    { left: 75, top: 85, duration: 2.8, delay: 1.5 },
                    { left: 85, top: 25, duration: 3.8, delay: 0.2 },
                    { left: 95, top: 55, duration: 3.3, delay: 0.9 },
                    { left: 10, top: 45, duration: 2.7, delay: 1.1 },
                    { left: 20, top: 90, duration: 3.6, delay: 0.4 },
                    { left: 30, top: 20, duration: 3.1, delay: 1.3 },
                    { left: 40, top: 70, duration: 2.9, delay: 0.7 },
                    { left: 50, top: 35, duration: 3.4, delay: 1.4 },
                    { left: 60, top: 5, duration: 3.7, delay: 0.1 },
                    { left: 70, top: 50, duration: 2.6, delay: 1.6 },
                    { left: 80, top: 65, duration: 3.9, delay: 0.35 },
                    { left: 90, top: 12, duration: 3.05, delay: 1.7 },
                    { left: 98, top: 42, duration: 2.95, delay: 0.85 },
                ].map((particle, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/30"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            delay: particle.delay,
                        }}
                    />
                ))}
            </motion.div>

            {/* Labels */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                <motion.p
                    className="text-muted text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Interactive 3D Agent Network • Hover to explore
                </motion.p>
            </div>
        </div>
    )
}

// Simpler 3D Card component for features
export function Card3D({
    children,
    className = '',
    glowColor = '#00D4FF'
}: {
    children: React.ReactNode
    className?: string
    glowColor?: string
}) {
    const cardRef = useRef<HTMLDivElement>(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const rotateX = useSpring(useTransform(mouseY, [-150, 150], [10, -10]), { stiffness: 200, damping: 20 })
    const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-10, 10]), { stiffness: 200, damping: 20 })

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left - rect.width / 2)
        mouseY.set(e.clientY - rect.top - rect.height / 2)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    return (
        <motion.div
            ref={cardRef}
            className={`relative ${className}`}
            style={{
                perspective: '1000px',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="w-full h-full rounded-2xl p-6"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 40px ${glowColor}10`,
                }}
            >
                <div style={{ transform: 'translateZ(20px)' }}>
                    {children}
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Agent3DNetwork
