'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout'
import { GlassCard, Button, Input } from '@/components/ui'
import { ReportCard, ReportListView, ReportViewer } from '@/components/reports'
import { Report, ReportListItem } from '@/types/report'
import {
    Squares2X2Icon,
    ListBulletIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon
} from '@heroicons/react/24/outline'

// Mock data
const mockReports: ReportListItem[] = [
    {
        id: '1',
        title: 'Apple XR Market Analysis Report',
        company: 'Apple Inc.',
        summary: 'Comprehensive analysis of Apple\'s position in the XR market, including competitive landscape, product roadmap, and growth opportunities.',
        createdAt: new Date('2024-01-15'),
        status: 'completed',
    },
    {
        id: '2',
        title: 'Meta VR Product Strategy',
        company: 'Meta Platforms',
        summary: 'Deep dive into Meta\'s VR product strategy, Quest lineup analysis, and market positioning against competitors.',
        createdAt: new Date('2024-01-14'),
        status: 'completed',
    },
    {
        id: '3',
        title: 'Microsoft Mixed Reality Opportunities',
        company: 'Microsoft',
        summary: 'Analysis of Microsoft\'s mixed reality initiatives, HoloLens roadmap, and enterprise market opportunities.',
        createdAt: new Date('2024-01-13'),
        status: 'completed',
    },
    {
        id: '4',
        title: 'NVIDIA AI/GPU Market Position',
        company: 'NVIDIA',
        summary: 'Research on NVIDIA\'s dominance in AI compute, market share analysis, and future growth vectors.',
        createdAt: new Date('2024-01-12'),
        status: 'generating',
    },
    {
        id: '5',
        title: 'OpenAI Product Roadmap Analysis',
        company: 'OpenAI',
        summary: 'Analysis of OpenAI\'s product offerings, API ecosystem, and competitive positioning in the AI market.',
        createdAt: new Date('2024-01-11'),
        status: 'completed',
    },
    {
        id: '6',
        title: 'Tesla Energy Division Growth',
        company: 'Tesla',
        summary: 'Deep analysis of Tesla\'s energy division, battery technology roadmap, and market expansion opportunities.',
        createdAt: new Date('2024-01-10'),
        status: 'completed',
    },
]

const mockFullReport: Report = {
    id: '1',
    title: 'Apple XR Market Analysis Report',
    company: 'Apple Inc.',
    domain: 'XR/VR',
    summary: 'Comprehensive analysis of Apple\'s position in the XR market',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'completed',
    agents: ['research', 'product', 'marketing'],
    content: `# Apple XR Market Analysis Report

## Executive Summary

Apple's entry into the XR (Extended Reality) market represents one of the most significant product launches in the company's history. This report provides a comprehensive analysis of Apple's position, opportunities, and challenges in this emerging market.

## Market Overview

### Current Market Size
- Global XR market valued at $31.12 billion in 2023
- Expected CAGR of 34.9% from 2024 to 2030
- Enterprise segment showing fastest growth

### Key Players
1. **Meta** - Market leader with Quest lineup
2. **Sony** - Strong gaming presence with PSVR
3. **Microsoft** - Enterprise focus with HoloLens
4. **Apple** - New entrant with Vision Pro

## Apple's Competitive Advantages

### Brand & Ecosystem
- Strong brand loyalty and premium positioning
- Seamless integration with existing Apple ecosystem
- Developer community and App Store infrastructure

### Technology
- Custom silicon (M-series chips) for performance
- Advanced display technology
- Sophisticated eye and hand tracking

### Design
- Premium materials and build quality
- Focus on user experience
- Innovative form factor

## Product Analysis: Vision Pro

### Specifications
- Micro-OLED displays (23 million pixels)
- M2 chip + R1 chip for real-time processing
- Advanced eye tracking for interaction
- Spatial audio integration

### Pricing Strategy
- Premium positioning at $3,499
- Target: Early adopters and professionals
- Gradual price reduction expected

## Marketing Recommendations

### Target Segments
1. **Creative Professionals** - Video editors, 3D designers
2. **Enterprise Users** - Training, collaboration
3. **Tech Enthusiasts** - Early adopters

### Key Messages
- "Spatial Computing" - New category creation
- Seamless integration with Apple ecosystem
- Premium experience worth the investment

### Channel Strategy
- Apple Retail stores for hands-on demos
- Online education and tutorials
- Enterprise sales team expansion

## Conclusion

Apple is well-positioned to capture significant market share in the XR space, leveraging its brand strength, ecosystem advantages, and technological innovation. The initial premium pricing strategy allows for margin protection while building the platform for future mass-market products.

---

*Report generated by CollabGen AI Agent System*
*Research Agent • Product Agent • Marketing Agent*
`,
    metadata: {
        wordCount: 342,
        sections: ['Executive Summary', 'Market Overview', 'Competitive Advantages', 'Product Analysis', 'Marketing Recommendations', 'Conclusion'],
        generationTime: 45,
    },
}

export default function ReportsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedReport, setSelectedReport] = useState<Report | null>(null)

    const filteredReports = mockReports.filter(
        (report) =>
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.company.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleView = (reportId: string) => {
        // In real app, fetch full report
        setSelectedReport(mockFullReport)
    }

    return (
        <div className="h-screen flex flex-col">
            <Header
                title="Reports"
                subtitle="View and manage generated reports"
            />

            <div className="flex-1 overflow-hidden flex">
                {/* Report list */}
                <div className={`flex-1 flex flex-col transition-all ${selectedReport ? 'hidden lg:flex lg:w-1/3' : ''}`}>
                    {/* Toolbar */}
                    <div className="p-4 border-b border-white/[0.08] bg-space-50/50">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Search */}
                            <div className="flex-1 w-full sm:w-auto">
                                <Input
                                    placeholder="Search reports..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-muted hover:text-white'
                                            }`}
                                    >
                                        <Squares2X2Icon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-muted hover:text-white'
                                            }`}
                                    >
                                        <ListBulletIcon className="w-4 h-4" />
                                    </button>
                                </div>

                                <button className="p-2 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-all">
                                    <FunnelIcon className="w-4 h-4" />
                                </button>

                                <Button size="sm" leftIcon={<PlusIcon className="w-4 h-4" />}>
                                    New Report
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Report list content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {filteredReports.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                                    <MagnifyingGlassIcon className="w-8 h-8 text-muted" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">No reports found</h3>
                                <p className="text-muted">Try adjusting your search query</p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {filteredReports.map((report) => (
                                        <ReportCard
                                            key={report.id}
                                            report={report}
                                            onView={() => handleView(report.id)}
                                            onDownload={() => { }}
                                            onDelete={() => { }}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {filteredReports.map((report) => (
                                        <ReportListView
                                            key={report.id}
                                            report={report}
                                            onView={() => handleView(report.id)}
                                            onDownload={() => { }}
                                            onDelete={() => { }}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* Report viewer */}
                <AnimatePresence>
                    {selectedReport && (
                        <motion.div
                            className={`flex-1 border-l border-white/[0.08] bg-space-50/30 ${selectedReport ? 'flex' : 'hidden'
                                }`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <ReportViewer
                                report={selectedReport}
                                onClose={() => setSelectedReport(null)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
