'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChatMessage as ChatMessageType } from '@/types/api'
import { AGENTS, AgentType } from '@/types/agent'
import { formatTime } from '@/lib/utils'
import { UserCircleIcon, SparklesIcon } from '@heroicons/react/24/solid'

interface ChatMessageProps {
    message: ChatMessageType
    className?: string
}

export function ChatMessage({ message, className }: ChatMessageProps) {
    const isUser = message.role === 'user'
    const agent = message.agentType ? AGENTS[message.agentType] : null

    return (
        <motion.div
            className={cn(
                'flex gap-3',
                isUser ? 'flex-row-reverse' : 'flex-row',
                className
            )}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            {/* Avatar */}
            <div
                className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
                    isUser
                        ? 'bg-gradient-to-br from-neon-purple to-neon-cyan'
                        : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10'
                )}
                style={
                    agent
                        ? {
                            background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}10)`,
                            borderColor: `${agent.color}40`,
                        }
                        : undefined
                }
            >
                {isUser ? (
                    <UserCircleIcon className="w-6 h-6 text-white" />
                ) : (
                    <SparklesIcon
                        className="w-5 h-5"
                        style={{ color: agent?.color || '#00D4FF' }}
                    />
                )}
            </div>

            {/* Message content */}
            <div className={cn('flex flex-col gap-1 max-w-[75%]', isUser && 'items-end')}>
                {/* Agent name if applicable */}
                {!isUser && agent && (
                    <span
                        className="text-xs font-medium px-2"
                        style={{ color: agent.color }}
                    >
                        {agent.name}
                    </span>
                )}

                {/* Message bubble */}
                <div
                    className={cn(
                        'px-5 py-3 rounded-2xl',
                        isUser
                            ? 'rounded-br-md bg-gradient-to-br from-neon-cyan/20 to-neon-purple/15 border border-neon-cyan/20'
                            : 'rounded-bl-md bg-white/5 border border-white/10'
                    )}
                >
                    {message.isStreaming ? (
                        <div className="flex items-center gap-2">
                            <span className="text-white/80">{message.content}</span>
                            <TypingIndicator />
                        </div>
                    ) : (
                        <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
                            {message.content}
                        </p>
                    )}
                </div>

                {/* Timestamp */}
                <span className="text-xs text-muted px-2">
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </motion.div>
    )
}

export function TypingIndicator() {
    return (
        <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
                    animate={{
                        scale: [0.8, 1, 0.8],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                />
            ))}
        </div>
    )
}

export function WelcomeMessage() {
    return (
        <motion.div
            className="flex flex-col items-center justify-center h-full text-center p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center mb-6 shadow-glow-sm">
                <SparklesIcon className="w-10 h-10 text-neon-cyan" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
                Welcome to CollabGen AI
            </h2>
            <p className="text-muted max-w-md mb-8">
                Start a conversation with our multi-agent AI system. Select a company and ask questions about research, products, or marketing strategies.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {[
                    'Analyze market position for Apple',
                    'Generate marketing strategy',
                    'Compare product features',
                    'Research industry trends',
                ].map((suggestion, i) => (
                    <motion.button
                        key={i}
                        className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-muted hover:text-white hover:border-white/20 hover:bg-white/10 transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                    >
                        {suggestion}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    )
}
