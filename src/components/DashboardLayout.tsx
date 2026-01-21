'use client'

import { useState } from 'react'
import Head from 'next/head'
import Sidebar from './Sidebar'
import ProtectedRoute from './ProtectedRoute'

interface DashboardLayoutProps {
    children: React.ReactNode
    title?: string
    requireAdmin?: boolean
}

export default function DashboardLayout({
    children,
    title = 'Dashboard',
    requireAdmin = false
}: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <ProtectedRoute requireAdmin={requireAdmin}>
            <Head>
                <title>{title} - Church Inventory System</title>
            </Head>

            <div className="min-h-screen bg-surface flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex-1 flex flex-col min-w-0">
                    {/* Mobile Header */}
                    <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 h-16 flex items-center">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="ml-4 text-lg font-display font-semibold text-gray-900">
                            {title}
                        </h1>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
