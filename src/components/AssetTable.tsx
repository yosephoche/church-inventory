'use client'

import { useState } from 'react'
import type { Asset } from '@/types/asset'
import StatusBadge from './StatusBadge'
import { formatIDR } from '@/utils/currency'

interface AssetTableProps {
    assets: Asset[]
    onEdit: (asset: Asset) => void
    onDelete: (asset: Asset) => void
    onSelect: (selectedIds: string[]) => void
    onShowQR: (asset: Asset) => void
    selectedIds: string[]
    isLoading: boolean
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalItems: number
    itemsPerPage: number
}

export default function AssetTable({
    assets,
    onEdit,
    onDelete,
    onSelect,
    onShowQR,
    selectedIds,
    isLoading,
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
}: AssetTableProps) {
    const toggleSelectAll = () => {
        if (selectedIds.length === assets.length) {
            onSelect([])
        } else {
            onSelect(assets.map((asset) => asset.id))
        }
    }

    const toggleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            onSelect(selectedIds.filter((selectedId) => selectedId !== id))
        } else {
            onSelect([...selectedIds, id])
        }
    }

    if (isLoading) {
        return (
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left w-12">
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Nama Aset
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Spesifikasi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Lokasi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Harga
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                        <div className="h-3 bg-gray-100 rounded w-24 mt-2"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end space-x-2">
                                            <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                                            <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                                            <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    if (assets.length === 0) {
        return (
            <div className="card p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                    Belum ada aset
                </h3>
                <p className="text-gray-500">
                    Silakan tambahkan aset baru untuk memulai.
                </p>
            </div>
        )
    }

    const startIndex = (currentPage - 1) * itemsPerPage + 1
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left w-12">
                                <input
                                    type="checkbox"
                                    checked={assets.length > 0 && selectedIds.length === assets.length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                            </th>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Nama Aset
                            </th>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Spesifikasi
                            </th>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Lokasi
                            </th>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Harga
                            </th>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {assets.map((asset, index) => (
                            <tr
                                key={asset.id}
                                className={`
                                    hover:bg-gray-50 transition-colors animate-fade-in
                                    ${selectedIds.includes(asset.id) ? 'bg-primary-50' : ''}
                                `}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(asset.id)}
                                        onChange={() => toggleSelectOne(asset.id)}
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                                    <div className="text-xs text-gray-500 font-mono">{asset.id.slice(0, 8)}...</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {asset.specification || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={asset.status} />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="font-medium">{asset.location || '-'}</div>
                                    {asset.location_detail && (
                                        <div className="text-xs text-gray-400">{asset.location_detail}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {formatIDR(asset.price)}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-right">
                                    <div className="flex justify-end space-x-2">
                                        {/* QR Code Button */}
                                        <button
                                            onClick={() => onShowQR(asset)}
                                            className="text-primary-600 hover:text-primary-900 bg-primary-50 p-2 rounded-lg hover:bg-primary-100 transition-colors"
                                            title="QR Code"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                        </button>
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => onEdit(asset)}
                                            className="text-gold-600 hover:text-gold-900 bg-gold-50 p-2 rounded-lg hover:bg-gold-100 transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => onDelete(asset)}
                                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                            title="Hapus"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            Menampilkan <span className="font-medium">{startIndex}</span> - <span className="font-medium">{endIndex}</span> dari <span className="font-medium">{totalItems}</span> aset
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn-ghost px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex items-center space-x-1">
                                {[...Array(totalPages)].map((_, i) => {
                                    const page = i + 1
                                    const isCurrentPage = page === currentPage
                                    const isNearCurrentPage = Math.abs(page - currentPage) <= 1
                                    const isFirstOrLast = page === 1 || page === totalPages

                                    if (!isNearCurrentPage && !isFirstOrLast) {
                                        if (page === 2 || page === totalPages - 1) {
                                            return <span key={page} className="px-2 text-gray-400">...</span>
                                        }
                                        return null
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => onPageChange(page)}
                                            className={`
                                                w-10 h-10 rounded-lg font-medium transition-colors
                                                ${isCurrentPage
                                                    ? 'bg-primary-500 text-white'
                                                    : 'text-gray-600 hover:bg-gray-200'
                                                }
                                            `}
                                        >
                                            {page}
                                        </button>
                                    )
                                })}
                            </div>
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="btn-ghost px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
