'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useChatStore, useAgentStore } from '@/store'
import { ChatMessage as ChatMessageComponent, WelcomeMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { AgentNetwork } from '@/components/agents'
import { GlassCard, Button } from '@/components/ui'
import { ChatMessage } from '@/types/api'
import { AgentActivity } from '@/types/agent'
import { apiService, PipelineRequest } from '@/lib/api'
import { usePipeline } from '@/hooks/usePipeline'

// Define domains locally to avoid import issues
const AVAILABLE_DOMAINS = [
    'XR', 'AI', 'Robotics', 'Healthcare', 'Finance',
    'Gaming', 'Education', 'Automotive', 'Retail', 'Manufacturing'
]

interface ChatContainerProps {
    className?: string
}

// Simple form for pipeline input
function PipelineForm({ onSubmit, isLoading }: { onSubmit: (req: PipelineRequest) => void; isLoading: boolean }) {
    const [companyName, setCompanyName] = useState('')
    const [partnerCompany, setPartnerCompany] = useState('')
    const [domain, setDomain] = useState<string>('AI')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (companyName && partnerCompany && domain) {
            onSubmit({ company_name: companyName, partner_company: partnerCompany, domain })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm text-white/70 mb-1">Company Name</label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Apple"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-cyan focus:outline-none"
                    required
                />
            </div>
            <div>
                <label className="block text-sm text-white/70 mb-1">Partner Company</label>
                <input
                    type="text"
                    value={partnerCompany}
                    onChange={(e) => setPartnerCompany(e.target.value)}
                    placeholder="e.g., Microsoft"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-cyan focus:outline-none"
                    required
                />
            </div>
            <div>
                <label className="block text-sm text-white/70 mb-1">Domain</label>
                <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-neon-cyan focus:outline-none"
                >
                    {AVAILABLE_DOMAINS.map((d) => (
                        <option key={d} value={d} className="bg-space-900">{d}</option>
                    ))}
                </select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Running Pipeline...
                    </span>
                ) : (
                    'Run Collaboration Analysis'
                )}
            </Button>
        </form>
    )
}

export function ChatContainer({ className }: ChatContainerProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { messages, addMessage, setLoading, selectedCompany } = useChatStore()
    const { setAgentStatus, addActivity } = useAgentStore()
    const { runPipeline, isLoading } = usePipeline()
    const [showForm, setShowForm] = useState(messages.length === 0)

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handlePipelineSubmit = async (request: PipelineRequest) => {
        setShowForm(false)
        setLoading(true)

        // Add user message
        addMessage({
            role: 'user',
            content: `Analyze collaboration opportunities between **${request.company_name}** and **${request.partner_company}** in the **${request.domain}** domain.`
        })

        try {
            // Start orchestrator
            setAgentStatus('orchestrator', 'running')
            addActivity({ agentType: 'orchestrator', action: 'Starting pipeline analysis' })

            // Start research agent
            setAgentStatus('research', 'running')
            addActivity({ agentType: 'research', action: 'Conducting market research' })

            // Make the actual API call
            const response = await runPipeline(request)

            if (response) {
                // Update agent statuses based on response
                if (response.sections.research.status === 'completed') {
                    setAgentStatus('research', 'completed')
                    addActivity({ agentType: 'research', action: 'Research analysis complete' })
                } else {
                    setAgentStatus('research', 'failed')
                }

                // Product agent
                setAgentStatus('product', response.sections.product.status === 'completed' ? 'completed' :
                    response.sections.product.status === 'skipped' ? 'idle' : 'failed')
                if (response.sections.product.status === 'completed') {
                    addActivity({ agentType: 'product', action: 'Product strategy generated' })
                }

                // Marketing agent
                setAgentStatus('marketing', response.sections.marketing.status === 'completed' ? 'completed' :
                    response.sections.marketing.status === 'skipped' ? 'idle' : 'failed')
                if (response.sections.marketing.status === 'completed') {
                    addActivity({ agentType: 'marketing', action: 'Marketing strategy complete' })
                }

                setAgentStatus('orchestrator', response.status === 'completed' ? 'completed' : 'failed')

                // Format the response
                const executionTime = (response.metadata.execution_time_ms / 1000).toFixed(1)
                const tokensUsed = response.metadata.tokens_used.toLocaleString()

                let messageContent = `## Collaboration Analysis Complete! ✓\n\n`
                messageContent += `**Companies:** ${request.company_name} & ${request.partner_company}\n`
                messageContent += `**Domain:** ${request.domain}\n`
                messageContent += `**Status:** ${response.status}\n`
                messageContent += `**Execution Time:** ${executionTime}s\n`
                messageContent += `**Tokens Used:** ${tokensUsed}\n\n`
                messageContent += `---\n\n`

                if (response.sections.research.status === 'completed') {
                    messageContent += `### 📊 Research Analysis\n\n`
                    messageContent += response.sections.research.content.substring(0, 500) + '...\n\n'
                }

                if (response.sections.product.status === 'completed') {
                    messageContent += `### 💡 Product Strategy\n\n`
                    messageContent += response.sections.product.content.substring(0, 500) + '...\n\n'
                }

                if (response.sections.marketing.status === 'completed') {
                    messageContent += `### 📈 Marketing Strategy\n\n`
                    messageContent += response.sections.marketing.content.substring(0, 500) + '...\n\n'
                }

                messageContent += `---\n\n`
                messageContent += `**Report ID:** \`${response.report_id}\`\n\n`
                messageContent += `[View Full Report →](/dashboard/reports/${response.report_id})`

                addMessage({
                    role: 'assistant',
                    content: messageContent,
                    agentType: 'orchestrator',
                })

                addActivity({ agentType: 'orchestrator', action: `Report generated: ${response.report_id.substring(0, 8)}...` })
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            addMessage({
                role: 'assistant',
                content: `❌ **Error running pipeline**\n\n${errorMessage}\n\nPlease check your API key configuration and try again.`,
            })
            setAgentStatus('orchestrator', 'failed')
            addActivity({ agentType: 'orchestrator', action: `Pipeline failed: ${errorMessage}` })
        } finally {
            setLoading(false)
            // Reset agent statuses after a delay
            setTimeout(() => {
                setAgentStatus('orchestrator', 'idle')
                setAgentStatus('research', 'idle')
                setAgentStatus('product', 'idle')
                setAgentStatus('marketing', 'idle')
            }, 3000)
        }
    }

    const handleSend = async (content: string) => {
        // For free-form messages, show the form to configure the pipeline
        addMessage({ role: 'user', content })

        addMessage({
            role: 'assistant',
            content: `I understand you want to analyze: "${content}"\n\nPlease use the form to specify the exact companies and domain for analysis.`,
        })

        setShowForm(true)
    }

    return (
        <div className={cn('flex h-full', className)}>
            {/* Main chat area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 && !showForm ? (
                        <WelcomeMessage />
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {messages.map((message: ChatMessage) => (
                                <ChatMessageComponent key={message.id} message={message} />
                            ))}
                        </AnimatePresence>
                    )}

                    {/* Pipeline Form */}
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-md mx-auto"
                        >
                            <GlassCard>
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Collaboration Analysis
                                </h3>
                                <p className="text-sm text-muted mb-4">
                                    Enter two companies to analyze their collaboration potential.
                                </p>
                                <PipelineForm onSubmit={handlePipelineSubmit} isLoading={isLoading} />
                            </GlassCard>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowForm(true)}
                            disabled={isLoading}
                        >
                            + New Analysis
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right sidebar - Agent visualization */}
            <div className="hidden lg:flex w-80 flex-col border-l border-white/[0.08] bg-space-50/50">
                <div className="p-4 border-b border-white/[0.08]">
                    <h3 className="text-sm font-semibold text-white">Agent Activity</h3>
                    <p className="text-xs text-muted">Real-time collaboration</p>
                </div>

                {/* Agent Network Visualization */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <AgentNetwork className="w-full h-64" />
                </div>

                {/* Activity Log */}
                <GlassCard className="m-4" padding="sm">
                    <h4 className="text-xs font-semibold text-white mb-3">Recent Activity</h4>
                    <ActivityLog />
                </GlassCard>
            </div>
        </div>
    )
}

function ActivityLog() {
    const allActivities = useAgentStore((state: { activities: AgentActivity[] }) => state.activities)
    const activities = allActivities.slice(0, 5)

    if (activities.length === 0) {
        return (
            <p className="text-xs text-muted text-center py-4">
                No activity yet. Start a conversation!
            </p>
        )
    }

    return (
        <div className="space-y-2">
            {activities.map((activity: AgentActivity, index: number) => (
                <motion.div
                    key={activity.id}
                    className="flex items-start gap-2 text-xs"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: '#00D4FF' }}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-white/80 truncate">{activity.action}</p>
                        <p className="text-muted text-[10px]">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
