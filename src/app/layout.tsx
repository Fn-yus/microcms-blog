import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
    title: 'Portfolio',
    description: 'Portfolio site',
}

import { Header } from "@/components/layout/header"

// ... imports

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
                <Header />
                {children}
            </body>
        </html>
    )
}
