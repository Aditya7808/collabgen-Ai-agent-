'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

export function Input({
    className,
    label,
    error,
    leftIcon,
    rightIcon,
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-white/80 mb-2"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                        {leftIcon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={cn(
                        'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur text-white placeholder-muted transition-all duration-200',
                        'focus:border-neon-cyan/50 focus:bg-white/[0.08] focus:outline-none focus:shadow-[0_0_20px_rgba(0,212,255,0.15)]',
                        leftIcon && 'pl-12',
                        rightIcon && 'pr-12',
                        error && 'border-red-500/50 focus:border-red-500',
                        className
                    )}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
        </div>
    )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

export function Textarea({
    className,
    label,
    error,
    id,
    ...props
}: TextareaProps) {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-white/80 mb-2"
                >
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={cn(
                    'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur text-white placeholder-muted transition-all duration-200 resize-none',
                    'focus:border-neon-cyan/50 focus:bg-white/[0.08] focus:outline-none focus:shadow-[0_0_20px_rgba(0,212,255,0.15)]',
                    error && 'border-red-500/50 focus:border-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
        </div>
    )
}
