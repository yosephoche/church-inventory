'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardStats from '@/components/DashboardStats'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Asset } from '@/types/asset'

export default function DashboardPage() {
    const { profile } = useAuth()
    const [assets, setAssets] = useState<Asset[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch assets for stats
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const { data, error } = await supabase
                    .from('assets')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setAssets(data || [])
            } catch (error) {
                console.error('Error fetching assets:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAssets()
    }, [])

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Selamat Pagi'
        if (hour < 18) return 'Selamat Siang'
        return 'Selamat Malam'
    }

    return (
        <DashboardLayout title="Dashboard">
            <div className="space-y-8">
                {/* Welcome Header */}
                <div className="hidden lg:block">
                    <h1 className="text-2xl font-display font-bold text-gray-900">
                        {getGreeting()}, {profile?.full_name || 'User'}!
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Selamat datang di Sistem Inventaris Gereja
                    </p>
                </div>

                {/* Stats Overview */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Ringkasan Aset
                    </h2>
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="card p-6 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <DashboardStats assets={assets} displayOnly />
                    )}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Aksi Cepat
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* View All Assets */}
                        <Link href="/dashboard/aset">
                            <a className="card p-6 hover:shadow-warm-md hover:-translate-y-0.5 transition-all duration-200 group">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-xl bg-primary-50 group-hover:bg-primary-100 transition-colors">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Lihat Semua Aset</h3>
                                        <p className="text-sm text-gray-500">Kelola daftar inventaris</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
                                    <span>Buka Halaman Aset</span>
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </a>
                        </Link>

                        {/* Add New Asset */}
                        <Link href="/dashboard/aset?action=add">
                            <a className="card p-6 hover:shadow-warm-md hover:-translate-y-0.5 transition-all duration-200 group">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Tambah Aset Baru</h3>
                                        <p className="text-sm text-gray-500">Daftarkan inventaris baru</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                                    <span>Buat Aset</span>
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </a>
                        </Link>

                        {/* Scan QR Code */}
                        <Link href="/scan">
                            <a className="card p-6 hover:shadow-warm-md hover:-translate-y-0.5 transition-all duration-200 group">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Scan QR Code</h3>
                                        <p className="text-sm text-gray-500">Lihat detail aset dengan scan</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                                    <span>Buka Scanner</span>
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </a>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity placeholder */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Aset Terbaru
                    </h2>
                    {isLoading ? (
                        <div className="card p-6 animate-pulse">
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : assets.length > 0 ? (
                        <div className="card overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {assets.slice(0, 5).map((asset) => (
                                    <li key={asset.id}>
                                        <Link href={`/asset/${asset.id}`}>
                                            <a className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <div className="ml-4 flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {asset.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {asset.specification || 'Tidak ada spesifikasi'}
                                                    </p>
                                                </div>
                                                <div className="ml-4">
                                                    <span className={`
                                                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                        ${asset.status === 'Terpakai' ? 'bg-green-100 text-green-800' : ''}
                                                        ${asset.status === 'Tidak Terpakai' ? 'bg-gray-100 text-gray-800' : ''}
                                                        ${asset.status === 'Rusak' ? 'bg-red-100 text-red-800' : ''}
                                                        ${asset.status === 'Perbaikan' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    `}>
                                                        {asset.status}
                                                    </span>
                                                </div>
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            {assets.length > 5 && (
                                <div className="border-t border-gray-100 p-4">
                                    <Link href="/dashboard/aset">
                                        <a className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center">
                                            Lihat semua {assets.length} aset
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-gray-900 font-medium mb-1">Belum ada aset</h3>
                            <p className="text-gray-500 text-sm mb-4">Mulai tambahkan aset pertama Anda</p>
                            <Link href="/dashboard/aset?action=add">
                                <a className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tambah Aset
                                </a>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
