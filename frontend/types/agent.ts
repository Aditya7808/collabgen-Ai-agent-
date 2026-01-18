export type AgentType = 'research' | 'product' | 'marketing' | 'critic' | 'orchestrator'

export type AgentStatus = 'idle' | 'pending' | 'running' | 'completed' | 'error' | 'failed'

export interface Agent {
    id: string
    type: AgentType
    name: string
    description: string
    status: AgentStatus
    color: string
    icon: string
}

export interface AgentMessage {
    id: string
    agentType: AgentType
    content: string
    timestamp: Date
    status: AgentStatus
}

export interface AgentActivity {
    id: string
    agentType: AgentType
    action: string
    timestamp: Date
    details?: string
}

export const AGENTS: Record<AgentType, Agent> = {
    research: {
        id: 'research',
        type: 'research',
        name: 'Research Agent',
        description: 'Market research, competitive analysis, and data gathering',
        status: 'idle',
        color: '#3B82F6',
        icon: 'search',
    },
    product: {
        id: 'product',
        type: 'product',
        name: 'Product Agent',
        description: 'Product ideation, USP definition, and feature planning',
        status: 'idle',
        color: '#10B981',
        icon: 'package',
    },
    marketing: {
        id: 'marketing',
        type: 'marketing',
        name: 'Marketing Agent',
        description: 'GTM strategy, regional insights, and sales positioning',
        status: 'idle',
        color: '#F97316',
        icon: 'megaphone',
    },
    critic: {
        id: 'critic',
        type: 'critic',
        name: 'Critic Agent',
        description: 'Quality assurance, validation, and improvement suggestions',
        status: 'idle',
        color: '#A855F7',
        icon: 'eye',
    },
    orchestrator: {
        id: 'orchestrator',
        type: 'orchestrator',
        name: 'Orchestrator',
        description: 'Coordinates all agents and manages the workflow',
        status: 'idle',
        color: '#00D4FF',
        icon: 'network',
    },
}
