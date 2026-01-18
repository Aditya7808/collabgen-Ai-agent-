'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CompanySelector } from '@/components/CompanySelector'
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
    title?: string
    subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-space/80 backdrop-blur-xl border-b border-white/[0.08]">
            {/* Left side - Title */}
            <div>
                {title && (
                    <motion.h1
                        className="text-xl font-semibold text-white"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {title}
                    </motion.h1>
                )}
                {subtitle && (
                    <motion.p
                        className="text-sm text-muted"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>

            {/* Right side - Company selector, notifications, profile */}
            <div className="flex items-center gap-4">
                {/* Company Selector */}
                <CompanySelector />

                {/* Notifications */}
                <button className="relative p-2 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all">
                    <BellIcon className="w-5 h-5" />
                    {/* Notification badge */}
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                </button>

                {/* Profile */}
                <button className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">A</span>
                    </div>
                    <span className="text-sm font-medium text-white hidden md:block">Admin</span>
                </button>
            </div>
        </header>
    )
}
