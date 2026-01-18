'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store'
import {
    ChevronDownIcon,
    BuildingOffice2Icon,
    CheckIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const companies = [
    { id: '1', name: 'Apple Inc.', domain: 'XR/VR' },
    { id: '2', name: 'Meta Platforms', domain: 'XR/VR' },
    { id: '3', name: 'Microsoft', domain: 'XR/VR' },
    { id: '4', name: 'Google', domain: 'AI/ML' },
    { id: '5', name: 'Amazon', domain: 'Cloud' },
    { id: '6', name: 'Tesla', domain: 'EV/Energy' },
    { id: '7', name: 'NVIDIA', domain: 'AI/GPU' },
    { id: '8', name: 'OpenAI', domain: 'AI/ML' },
]

interface CompanySelectorProps {
    className?: string
}

export function CompanySelector({ className }: CompanySelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const { selectedCompany, setSelectedCompany } = useChatStore()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredCompanies = companies.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.domain.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const selectedCompanyData = companies.find((c) => c.name === selectedCompany)

    return (
        <div ref={dropdownRef} className={cn('relative', className)}>
            {/* Trigger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200',
                    isOpen
                        ? 'border-neon-cyan/50 bg-white/[0.08] shadow-[0_0_20px_rgba(0,212,255,0.15)]'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                )}
            >
                <BuildingOffice2Icon className="w-5 h-5 text-muted" />
                <span className="text-sm font-medium text-white min-w-[120px] text-left">
                    {selectedCompany || 'Select Company'}
                </span>
                <ChevronDownIcon
                    className={cn(
                        'w-4 h-4 text-muted transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-white/[0.08] bg-space-50/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden z-50"
                    >
                        {/* Search input */}
                        <div className="p-3 border-b border-white/[0.08]">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search companies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder-muted focus:border-neon-cyan/50 focus:outline-none transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Company list */}
                        <div className="max-h-64 overflow-y-auto py-2">
                            {filteredCompanies.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-muted text-center">
                                    No companies found
                                </p>
                            ) : (
                                filteredCompanies.map((company) => (
                                    <button
                                        key={company.id}
                                        onClick={() => {
                                            setSelectedCompany(company.name)
                                            setIsOpen(false)
                                            setSearchQuery('')
                                        }}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all',
                                            selectedCompany === company.name
                                                ? 'bg-neon-cyan/10 text-white'
                                                : 'text-muted hover:bg-white/5 hover:text-white'
                                        )}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                                            <span className="text-xs font-semibold text-white/80">
                                                {company.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{company.name}</p>
                                            <p className="text-xs text-muted">{company.domain}</p>
                                        </div>
                                        {selectedCompany === company.name && (
                                            <CheckIcon className="w-4 h-4 text-neon-cyan" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
