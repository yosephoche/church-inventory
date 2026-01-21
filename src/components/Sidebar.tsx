'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'

interface NavItem {
    name: string
    href: string
    icon: React.ReactNode
    adminOnly?: boolean
}

const navigation: NavItem[] = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        name: 'Aset',
        href: '/dashboard/aset',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    },
    {
        name: 'Pengguna',
        href: '/dashboard/users',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        adminOnly: true,
    },
]

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const router = useRouter()
    const { profile, signOut, isAdmin } = useAuth()

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
    }

    const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin)

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
                    transform transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:z-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-display font-bold text-gray-900">
                                    Inventaris
                                </h1>
                                <p className="text-xs text-gray-500">Church System</p>
                            </div>
                        </div>
                        {/* Mobile close button */}
                        <button
                            onClick={onClose}
                            className="lg:hidden ml-auto p-2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin">
                        {filteredNavigation.map((item) => {
                            const isActive = router.pathname === item.href ||
                                (item.href !== '/dashboard' && router.pathname.startsWith(item.href))

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                >
                                    <a
                                        onClick={onClose}
                                        className={`
                                            flex items-center px-4 py-3 rounded-xl text-sm font-medium
                                            transition-all duration-200
                                            ${isActive
                                                ? 'bg-primary-50 text-primary-700 shadow-warm-sm'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        <span className={isActive ? 'text-primary-600' : 'text-gray-400'}>
                                            {item.icon}
                                        </span>
                                        <span className="ml-3">{item.name}</span>
                                        {item.adminOnly && (
                                            <span className="ml-auto px-2 py-0.5 text-xs bg-gold-100 text-gold-700 rounded-full">
                                                Admin
                                            </span>
                                        )}
                                    </a>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-700 font-semibold text-sm">
                                    {profile?.full_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {profile?.full_name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {profile?.email}
                                </p>
                            </div>
                            {isAdmin && (
                                <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                                    Admin
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
