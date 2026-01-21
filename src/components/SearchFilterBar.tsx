'use client'

import { STATUS_OPTIONS, LOCATION_OPTIONS } from '@/utils/constants'
import type { AssetStatus, AssetLocation } from '@/types/asset'

interface SearchFilterBarProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    statusFilter: AssetStatus | null
    onStatusChange: (status: AssetStatus | null) => void
    locationFilter: AssetLocation | null
    onLocationChange: (location: AssetLocation | null) => void
    onAddNew: () => void
}

export default function SearchFilterBar({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    locationFilter,
    onLocationChange,
    onAddNew,
}: SearchFilterBarProps) {
    const hasFilters = searchQuery || statusFilter || locationFilter

    const clearAllFilters = () => {
        onSearchChange('')
        onStatusChange(null)
        onLocationChange(null)
    }

    return (
        <div className="card p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Cari nama aset atau spesifikasi..."
                        className="input pl-10"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Status Filter */}
                    <select
                        value={statusFilter || ''}
                        onChange={(e) => onStatusChange(e.target.value as AssetStatus || null)}
                        className="select min-w-[160px]"
                    >
                        <option value="">Semua Status</option>
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Location Filter */}
                    <select
                        value={locationFilter || ''}
                        onChange={(e) => onLocationChange(e.target.value as AssetLocation || null)}
                        className="select min-w-[160px]"
                    >
                        <option value="">Semua Lokasi</option>
                        {LOCATION_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Clear Filters */}
                    {hasFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="btn-ghost text-sm whitespace-nowrap"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Hapus Filter
                        </button>
                    )}

                    {/* Add New Button */}
                    <button onClick={onAddNew} className="btn-primary whitespace-nowrap">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Aset
                    </button>
                </div>
            </div>
        </div>
    )
}
