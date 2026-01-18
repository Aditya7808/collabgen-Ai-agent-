'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}: ButtonProps) {
    const baseClasses = 'relative inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
        primary: 'text-white bg-gradient-to-r from-neon-cyan to-[#0099CC] shadow-[0_4px_20px_rgba(0,212,255,0.3)] hover:shadow-[0_6px_30px_rgba(0,212,255,0.5)] hover:-translate-y-0.5 active:translate-y-0',
        secondary: 'text-white border border-white/10 bg-white/5 backdrop-blur hover:border-white/20 hover:bg-white/10',
        ghost: 'text-muted hover:text-white hover:bg-white/5',
        danger: 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-[0_4px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_30px_rgba(239,68,68,0.5)] hover:-translate-y-0.5',
    }

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    return (
        <button
            className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {leftIcon}
                    {children}
                    {rightIcon}
                </>
            )}
        </button>
    )
}
