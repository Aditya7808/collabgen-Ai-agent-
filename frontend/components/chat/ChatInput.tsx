'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { useChatStore } from '@/store'
import { PaperAirplaneIcon, StopIcon } from '@heroicons/react/24/solid'

interface ChatInputProps {
    onSend: (message: string) => void
    disabled?: boolean
    className?: string
}

export function ChatInput({ onSend, disabled, className }: ChatInputProps) {
    const [message, setMessage] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { isLoading, isStreaming } = useChatStore()

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
        }
    }, [message])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim() && !disabled && !isLoading) {
            onSend(message.trim())
            setMessage('')
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            className={cn(
                'relative flex items-end gap-3 p-4 border-t border-white/[0.08] bg-space-50/80 backdrop-blur-xl',
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Input container */}
            <div className="flex-1 relative">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={disabled || isLoading}
                    rows={1}
                    className={cn(
                        'w-full px-5 py-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur resize-none',
                        'text-white placeholder-muted transition-all duration-200',
                        'focus:border-neon-cyan/50 focus:bg-white/[0.08] focus:outline-none focus:shadow-[0_0_20px_rgba(0,212,255,0.15)]',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'pr-14'
                    )}
                />

                {/* Character count for long messages */}
                {message.length > 200 && (
                    <span className="absolute right-4 bottom-3 text-xs text-muted">
                        {message.length}/2000
                    </span>
                )}
            </div>

            {/* Send/Stop button */}
            {isStreaming ? (
                <Button
                    type="button"
                    variant="danger"
                    size="md"
                    className="flex-shrink-0 w-12 h-12 !p-0 rounded-xl"
                    onClick={() => {/* Cancel streaming */ }}
                >
                    <StopIcon className="w-5 h-5" />
                </Button>
            ) : (
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!message.trim() || disabled || isLoading}
                    isLoading={isLoading}
                    className="flex-shrink-0 w-12 h-12 !p-0 rounded-xl"
                >
                    {!isLoading && <PaperAirplaneIcon className="w-5 h-5" />}
                </Button>
            )}
        </motion.form>
    )
}
