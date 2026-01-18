import { create } from 'zustand'
import { ChatMessage } from '@/types/api'

interface ChatState {
    messages: ChatMessage[]
    isLoading: boolean
    isStreaming: boolean
    selectedCompany: string | null
    selectedDomain: string

    // Actions
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
    updateMessage: (id: string, content: string) => void
    setStreaming: (isStreaming: boolean) => void
    setLoading: (isLoading: boolean) => void
    setSelectedCompany: (company: string | null) => void
    setSelectedDomain: (domain: string) => void
    clearMessages: () => void
    reset: () => void
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isLoading: false,
    isStreaming: false,
    selectedCompany: null,
    selectedDomain: 'XR',

    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) =>
        set((state: ChatState) => ({
            messages: [
                ...state.messages,
                {
                    ...message,
                    id: Math.random().toString(36).substring(2, 15),
                    timestamp: new Date(),
                },
            ],
        })),

    updateMessage: (id: string, content: string) =>
        set((state: ChatState) => ({
            messages: state.messages.map((msg: ChatMessage) =>
                msg.id === id ? { ...msg, content, isStreaming: false } : msg
            ),
        })),

    setStreaming: (isStreaming: boolean) => set({ isStreaming }),

    setLoading: (isLoading: boolean) => set({ isLoading }),

    setSelectedCompany: (company: string | null) => set({ selectedCompany: company }),

    setSelectedDomain: (domain: string) => set({ selectedDomain: domain }),

    clearMessages: () => set({ messages: [] }),

    reset: () =>
        set({
            messages: [],
            isLoading: false,
            isStreaming: false,
            selectedCompany: null,
            selectedDomain: 'XR',
        }),
}))
