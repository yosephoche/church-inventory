'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
    const router = useRouter()
    const { user, isLoading } = useAuth()

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                router.replace('/dashboard')
            } else {
                router.replace('/login')
            }
        }
    }, [user, isLoading, router])

    return (
        <>
            <Head>
                <title>Church Inventory System</title>
                <meta name="description" content="Manage church assets with QR codes" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 font-medium">Memuat...</p>
                </div>
            </div>
        </>
    )
}
