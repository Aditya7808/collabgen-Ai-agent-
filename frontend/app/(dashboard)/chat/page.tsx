'use client'

import React from 'react'
import { Header } from '@/components/layout'
import { ChatContainer } from '@/components/chat'

export default function ChatPage() {
    return (
        <div className="h-screen flex flex-col">
            <Header
                title="Chat"
                subtitle="Interact with the multi-agent AI system"
            />
            <div className="flex-1 overflow-hidden">
                <ChatContainer />
            </div>
        </div>
    )
}
