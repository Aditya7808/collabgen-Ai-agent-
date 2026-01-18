'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
    HomeIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SparklesIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
    className?: string
}

const navItems = [
    { href: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { href: '/dashboard/chat', icon: ChatBubbleLeftRightIcon, label: 'Chat' },
    { href: '/dashboard/reports', icon: DocumentTextIcon, label: 'Reports' },
    { href: '/dashboard/settings', icon: Cog6ToothIcon, label: 'Settings' },
]

export function Sidebar({ className }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <motion.aside
            className={cn(
                'fixed left-0 top-0 bottom-0 z-40 flex flex-col',
                'bg-space-50/80 backdrop-blur-xl border-r border-white/[0.08]',
                className
            )}
            initial={false}
            animate={{ width: isCollapsed ? 72 : 240 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 p-4 border-b border-white/[0.08]">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-glow-sm">
                    <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                        >
                            <h1 className="font-bold text-white whitespace-nowrap">CollabGen</h1>
                            <p className="text-xs text-muted">AI Agent Platform</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href))

                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                className={cn(
                                    'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer group',
                                    isActive
                                        ? 'bg-white/10 text-white shadow-[inset_0_0_20px_rgba(0,212,255,0.1)]'
                                        : 'text-muted hover:text-white hover:bg-white/5'
                                )}
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <item.icon
                                    className={cn(
                                        'w-5 h-5 flex-shrink-0 transition-colors',
                                        isActive && 'text-neon-cyan'
                                    )}
                                />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            className="font-medium whitespace-nowrap"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Active indicator */}
                                {isActive && (
                                    <motion.div
                                        className="absolute left-0 w-1 h-8 bg-gradient-to-b from-neon-cyan to-neon-purple rounded-r-full"
                                        layoutId="activeIndicator"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
            </nav>

            {/* Collapse button */}
            <div className="p-3 border-t border-white/[0.08]">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all"
                >
                    {isCollapsed ? (
                        <ChevronRightIcon className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeftIcon className="w-5 h-5" />
                            <span className="text-sm">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </motion.aside>
    )
}
