import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'CollabGen AI Agent | Multi-Agent Collaboration Platform',
    description: 'A sophisticated multi-agent AI system designed for collaborative intelligence and automated business analysis. Leverage specialized AI agents for research, product analysis, marketing strategies, and critical evaluation.',
    keywords: ['AI', 'Multi-Agent', 'Collaboration', 'Business Analysis', 'Research', 'Marketing', 'Product Analysis'],
    authors: [{ name: 'CollabGen Team' }],
    openGraph: {
        title: 'CollabGen AI Agent',
        description: 'Multi-Agent AI Collaboration System for Enterprise Workflows',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="antialiased" suppressHydrationWarning>
                {children}
            </body>
        </html>
    )
}
