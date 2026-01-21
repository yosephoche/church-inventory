'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, isAdmin, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.replace('/login')
            } else if (user.user_metadata?.password_set === false) {
                // User needs to complete password setup first
                router.replace('/auth/set-password')
            } else if (requireAdmin && !isAdmin) {
                router.replace('/dashboard')
            }
        }
    }, [user, isAdmin, isLoading, requireAdmin, router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 font-medium">Memuat...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    if (requireAdmin && !isAdmin) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">Akses Ditolak</h2>
                    <p className="text-gray-600 mb-6">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="btn-primary"
                    >
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
