'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardStats from '@/components/DashboardStats'
import SearchFilterBar from '@/components/SearchFilterBar'
import AssetTable from '@/components/AssetTable'
import AssetFormModal from '@/components/AssetFormModal'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import BulkActionsToolbar from '@/components/BulkActionsToolbar'
import QRCodeModal from '@/components/QRCodeModal'
import BatchQRCodePrint from '@/components/BatchQRCodePrint'
import { supabase } from '@/lib/supabase'
import type { Asset, AssetFormInput, AssetStatus, AssetLocation } from '@/types/asset'

const ITEMS_PER_PAGE = 10

export default function AsetPage() {
    const router = useRouter()

    // Data state
    const [allAssets, setAllAssets] = useState<Asset[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Filter state
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<AssetStatus | null>(null)
    const [locationFilter, setLocationFilter] = useState<AssetLocation | null>(null)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)

    // Selection state
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Modal state
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add')
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isBulkDelete, setIsBulkDelete] = useState(false)

    const [isQRModalOpen, setIsQRModalOpen] = useState(false)
    const [qrAsset, setQRAsset] = useState<Asset | null>(null)

    const [isBatchQROpen, setIsBatchQROpen] = useState(false)

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    // Fetch assets
    const fetchAssets = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('assets')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setAllAssets(data || [])
        } catch (error) {
            console.error('Error fetching assets:', error)
            showToast('Gagal memuat data aset', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAssets()
    }, [])

    // Handle action query parameter (e.g., ?action=add)
    useEffect(() => {
        if (router.query.action === 'add') {
            setFormMode('add')
            setEditingAsset(null)
            setIsFormModalOpen(true)
            // Remove the query parameter from URL
            router.replace('/dashboard/aset', undefined, { shallow: true })
        }
    }, [router.query.action])

    // Filtered assets
    const filteredAssets = useMemo(() => {
        return allAssets.filter((asset) => {
            const matchesSearch = !searchQuery ||
                asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.specification?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = !statusFilter || asset.status === statusFilter
            const matchesLocation = !locationFilter || asset.location === locationFilter

            return matchesSearch && matchesStatus && matchesLocation
        })
    }, [allAssets, searchQuery, statusFilter, locationFilter])

    // Pagination
    const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE)
    const paginatedAssets = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredAssets.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredAssets, currentPage])

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, statusFilter, locationFilter])

    // Clear selection when page changes
    useEffect(() => {
        setSelectedIds([])
    }, [currentPage])

    // Toast helper
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    // Handlers
    const handleAddNew = () => {
        setFormMode('add')
        setEditingAsset(null)
        setIsFormModalOpen(true)
    }

    const handleEdit = (asset: Asset) => {
        setFormMode('edit')
        setEditingAsset(asset)
        setIsFormModalOpen(true)
    }

    const handleDelete = (asset: Asset) => {
        setDeletingAsset(asset)
        setIsBulkDelete(false)
        setIsDeleteModalOpen(true)
    }

    const handleBulkDelete = () => {
        setDeletingAsset(null)
        setIsBulkDelete(true)
        setIsDeleteModalOpen(true)
    }

    const handleShowQR = (asset: Asset) => {
        setQRAsset(asset)
        setIsQRModalOpen(true)
    }

    const handleBulkPrintQR = () => {
        setIsBatchQROpen(true)
    }

    const handleSaveAsset = async (data: AssetFormInput) => {
        try {
            if (formMode === 'add') {
                const { error } = await supabase
                    .from('assets')
                    .insert([{
                        name: data.name,
                        specification: data.specification || null,
                        purchase_date: data.purchase_date || null,
                        price: data.price || null,
                        notes: data.notes || null,
                        status: data.status,
                        location: data.location || null,
                        location_detail: data.location_detail || null,
                    }])

                if (error) throw error
                showToast('Aset berhasil ditambahkan', 'success')
            } else if (editingAsset) {
                const { error } = await supabase
                    .from('assets')
                    .update({
                        name: data.name,
                        specification: data.specification || null,
                        purchase_date: data.purchase_date || null,
                        price: data.price || null,
                        notes: data.notes || null,
                        status: data.status,
                        location: data.location || null,
                        location_detail: data.location_detail || null,
                    })
                    .eq('id', editingAsset.id)

                if (error) throw error
                showToast('Aset berhasil diperbarui', 'success')
            }

            await fetchAssets()
        } catch (error) {
            console.error('Error saving asset:', error)
            showToast('Gagal menyimpan aset', 'error')
            throw error
        }
    }

    const handleConfirmDelete = async () => {
        setIsDeleting(true)
        try {
            if (isBulkDelete) {
                const { error } = await supabase
                    .from('assets')
                    .delete()
                    .in('id', selectedIds)

                if (error) throw error
                showToast(`${selectedIds.length} aset berhasil dihapus`, 'success')
                setSelectedIds([])
            } else if (deletingAsset) {
                const { error } = await supabase
                    .from('assets')
                    .delete()
                    .eq('id', deletingAsset.id)

                if (error) throw error
                showToast('Aset berhasil dihapus', 'success')
            }

            await fetchAssets()
            setIsDeleteModalOpen(false)
        } catch (error) {
            console.error('Error deleting asset:', error)
            showToast('Gagal menghapus aset', 'error')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleFilterByStatus = (status: AssetStatus | null) => {
        setStatusFilter(status)
    }

    // Get selected assets for bulk QR print
    const selectedAssets = useMemo(() => {
        return allAssets.filter(asset => selectedIds.includes(asset.id))
    }, [allAssets, selectedIds])

    return (
        <DashboardLayout title="Aset">
            <div className="space-y-6">
                {/* Page Header */}
                <div className="hidden lg:block">
                    <h1 className="text-2xl font-display font-bold text-gray-900">
                        Manajemen Aset
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Kelola inventaris aset gereja dengan mudah
                    </p>
                </div>

                {/* Stats */}
                <DashboardStats
                    assets={allAssets}
                    onFilterByStatus={handleFilterByStatus}
                    activeStatusFilter={statusFilter}
                />

                {/* Search & Filter */}
                <SearchFilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    locationFilter={locationFilter}
                    onLocationChange={setLocationFilter}
                    onAddNew={handleAddNew}
                />

                {/* Asset Table */}
                <AssetTable
                    assets={paginatedAssets}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSelect={setSelectedIds}
                    onShowQR={handleShowQR}
                    selectedIds={selectedIds}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredAssets.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>

            {/* Bulk Actions Toolbar */}
            <BulkActionsToolbar
                selectedCount={selectedIds.length}
                onPrintQR={handleBulkPrintQR}
                onDelete={handleBulkDelete}
                onCancel={() => setSelectedIds([])}
            />

            {/* Asset Form Modal */}
            <AssetFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveAsset}
                asset={editingAsset}
                mode={formMode}
            />

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={isBulkDelete ? 'Hapus Beberapa Aset?' : 'Hapus Aset?'}
                message={
                    isBulkDelete
                        ? `Anda akan menghapus ${selectedIds.length} aset. Tindakan ini tidak dapat dibatalkan.`
                        : `Anda akan menghapus aset "${deletingAsset?.name}". Tindakan ini tidak dapat dibatalkan.`
                }
                isDeleting={isDeleting}
                itemCount={isBulkDelete ? selectedIds.length : 1}
            />

            {/* QR Code Modal */}
            <QRCodeModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                asset={qrAsset}
            />

            {/* Batch QR Print Modal */}
            <BatchQRCodePrint
                isOpen={isBatchQROpen}
                onClose={() => setIsBatchQROpen(false)}
                assets={selectedAssets}
            />

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 animate-slide-up ${selectedIds.length > 0 ? 'mb-20' : ''}`}>
                    <div className={`
                        px-4 py-3 rounded-lg shadow-warm-lg flex items-center space-x-3
                        ${toast.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
                    `}>
                        {toast.type === 'success' ? (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        )}
                        <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                            {toast.message}
                        </p>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
