import { create } from 'zustand'
import { AgentType, AgentStatus, AGENTS, Agent, AgentActivity } from '@/types/agent'

interface AgentState {
    agents: Record<AgentType, Agent>
    activities: AgentActivity[]
    activeAgents: AgentType[]

    // Actions
    setAgentStatus: (agentType: AgentType, status: AgentStatus) => void
    setAllAgentsStatus: (status: AgentStatus) => void
    addActivity: (activity: Omit<AgentActivity, 'id' | 'timestamp'>) => void
    clearActivities: () => void
    setActiveAgents: (agents: AgentType[]) => void
    reset: () => void
}

export const useAgentStore = create<AgentState>((set) => ({
    agents: { ...AGENTS },
    activities: [],
    activeAgents: [],

    setAgentStatus: (agentType: AgentType, status: AgentStatus) =>
        set((state: AgentState) => ({
            agents: {
                ...state.agents,
                [agentType]: { ...state.agents[agentType], status },
            },
        })),

    setAllAgentsStatus: (status: AgentStatus) =>
        set((state: AgentState) => {
            const updatedAgents = {} as Record<AgentType, Agent>
            for (const key of Object.keys(state.agents) as AgentType[]) {
                updatedAgents[key] = { ...state.agents[key], status }
            }
            return { agents: updatedAgents }
        }),

    addActivity: (activity: Omit<AgentActivity, 'id' | 'timestamp'>) =>
        set((state: AgentState) => ({
            activities: [
                {
                    ...activity,
                    id: Math.random().toString(36).substring(2, 15),
                    timestamp: new Date(),
                },
                ...state.activities,
            ].slice(0, 50), // Keep only last 50 activities
        })),

    clearActivities: () => set({ activities: [] }),

    setActiveAgents: (agents: AgentType[]) => set({ activeAgents: agents }),

    reset: () =>
        set({
            agents: { ...AGENTS },
            activities: [],
            activeAgents: [],
        }),
}))
