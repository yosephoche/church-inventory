'use client'

import { useEffect, useState } from 'react'
import type { Asset, AssetStatus } from '@/types/asset'

interface StatsCardProps {
    title: string
    count: number
    icon: React.ReactNode
    color: string
    bgColor: string
    onClick?: () => void
    isActive?: boolean
}

function StatsCard({ title, count, icon, color, bgColor, onClick, isActive }: StatsCardProps) {
    const [displayCount, setDisplayCount] = useState(0)

    useEffect(() => {
        const duration = 500
        const steps = 20
        const increment = count / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= count) {
                setDisplayCount(count)
                clearInterval(timer)
            } else {
                setDisplayCount(Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [count])

    return (
        <button
            onClick={onClick}
            className={`
                card p-6 text-left transition-all duration-200 w-full
                ${onClick ? 'cursor-pointer hover:shadow-warm-md hover:-translate-y-0.5' : ''}
                ${isActive ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
            `}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-display font-bold text-gray-900">
                        {displayCount}
                    </p>
                </div>
                <div className={`p-3 rounded-xl ${bgColor}`}>
                    <span className={color}>{icon}</span>
                </div>
            </div>
        </button>
    )
}

interface DashboardStatsProps {
    assets: Asset[]
    onFilterByStatus?: (status: AssetStatus | null) => void
    activeStatusFilter?: AssetStatus | null
    displayOnly?: boolean
}

export default function DashboardStats({ assets, onFilterByStatus, activeStatusFilter, displayOnly = false }: DashboardStatsProps) {
    const totalAssets = assets.length
    const terpakaiCount = assets.filter(a => a.status === 'Terpakai').length
    const tidakTerpakaiCount = assets.filter(a => a.status === 'Tidak Terpakai').length
    const rusakCount = assets.filter(a => a.status === 'Rusak').length
    const perbaikanCount = assets.filter(a => a.status === 'Perbaikan').length

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatsCard
                title="Total Aset"
                count={totalAssets}
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                }
                color="text-primary-600"
                bgColor="bg-primary-50"
                onClick={displayOnly ? undefined : () => onFilterByStatus?.(null)}
                isActive={!displayOnly && activeStatusFilter === null}
            />
            <StatsCard
                title="Terpakai"
                count={terpakaiCount}
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
                color="text-green-600"
                bgColor="bg-green-50"
                onClick={displayOnly ? undefined : () => onFilterByStatus?.('Terpakai')}
                isActive={!displayOnly && activeStatusFilter === 'Terpakai'}
            />
            <StatsCard
                title="Tidak Terpakai"
                count={tidakTerpakaiCount}
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                }
                color="text-gray-600"
                bgColor="bg-gray-100"
                onClick={displayOnly ? undefined : () => onFilterByStatus?.('Tidak Terpakai')}
                isActive={!displayOnly && activeStatusFilter === 'Tidak Terpakai'}
            />
            <StatsCard
                title="Rusak"
                count={rusakCount}
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                }
                color="text-red-600"
                bgColor="bg-red-50"
                onClick={displayOnly ? undefined : () => onFilterByStatus?.('Rusak')}
                isActive={!displayOnly && activeStatusFilter === 'Rusak'}
            />
            <StatsCard
                title="Perbaikan"
                count={perbaikanCount}
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                }
                color="text-yellow-600"
                bgColor="bg-yellow-50"
                onClick={displayOnly ? undefined : () => onFilterByStatus?.('Perbaikan')}
                isActive={!displayOnly && activeStatusFilter === 'Perbaikan'}
            />
        </div>
    )
}
