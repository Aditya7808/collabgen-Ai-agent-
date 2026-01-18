'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sidebar, Header } from '@/components/layout'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-space">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <motion.main
                className="ml-[240px] min-h-screen transition-all duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.main>
        </div>
    )
}
