'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { Asset, AssetFormInput, AssetStatus, AssetLocation } from '@/types/asset'
import { STATUS_OPTIONS, LOCATION_OPTIONS } from '@/utils/constants'

interface AssetFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: AssetFormInput) => Promise<void>
    asset?: Asset | null
    mode: 'add' | 'edit'
}

export default function AssetFormModal({
    isOpen,
    onClose,
    onSave,
    asset,
    mode,
}: AssetFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<AssetFormInput>({
        defaultValues: {
            status: 'Terpakai' as AssetStatus,
        },
    })

    useEffect(() => {
        if (asset && mode === 'edit') {
            setValue('name', asset.name)
            setValue('specification', asset.specification || '')
            setValue('purchase_date', asset.purchase_date || '')
            setValue('price', asset.price || undefined)
            setValue('notes', asset.notes || '')
            setValue('status', asset.status)
            setValue('location', asset.location || undefined)
            setValue('location_detail', asset.location_detail || '')
        } else if (mode === 'add') {
            reset({
                status: 'Terpakai' as AssetStatus,
            })
        }
    }, [asset, mode, setValue, reset])

    const onSubmit = async (data: AssetFormInput) => {
        setIsSubmitting(true)
        try {
            await onSave(data)
            reset()
            onClose()
        } catch (error) {
            console.error('Error saving asset:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-900/50"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl animate-scale-in">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-display font-semibold text-gray-900">
                            {mode === 'add' ? 'Tambah Aset Baru' : 'Edit Aset'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="label">
                                Nama Aset <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name', { required: 'Nama aset wajib diisi' })}
                                className={errors.name ? 'input-error' : 'input'}
                                placeholder="e.g., Projector, Sound System"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Specification Field */}
                        <div>
                            <label htmlFor="specification" className="label">
                                Spesifikasi
                            </label>
                            <input
                                id="specification"
                                type="text"
                                {...register('specification')}
                                className="input"
                                placeholder="e.g., Model XYZ-123, 1080p"
                            />
                        </div>

                        {/* Status and Location Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Status Field */}
                            <div>
                                <label htmlFor="status" className="label">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="status"
                                    {...register('status', { required: 'Status wajib dipilih' })}
                                    className="select"
                                >
                                    {STATUS_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Location Field */}
                            <div>
                                <label htmlFor="location" className="label">
                                    Lokasi
                                </label>
                                <select
                                    id="location"
                                    {...register('location')}
                                    className="select"
                                >
                                    <option value="">Pilih Lokasi</option>
                                    {LOCATION_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location Detail */}
                        <div>
                            <label htmlFor="location_detail" className="label">
                                Detail Lokasi
                            </label>
                            <input
                                id="location_detail"
                                type="text"
                                {...register('location_detail')}
                                className="input"
                                placeholder="e.g., Rak 2, Bagian kiri"
                            />
                        </div>

                        {/* Purchase Date and Price Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Purchase Date */}
                            <div>
                                <label htmlFor="purchase_date" className="label">
                                    Tanggal Pembelian
                                </label>
                                <input
                                    id="purchase_date"
                                    type="date"
                                    {...register('purchase_date')}
                                    className="input"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="label">
                                    Harga
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
                                    <input
                                        id="price"
                                        type="number"
                                        {...register('price', {
                                            min: { value: 0, message: 'Harga harus positif' },
                                        })}
                                        className="input pl-10"
                                        placeholder="0"
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Notes Field */}
                        <div>
                            <label htmlFor="notes" className="label">
                                Catatan
                            </label>
                            <textarea
                                id="notes"
                                rows={3}
                                {...register('notes')}
                                className="input resize-none"
                                placeholder="Informasi tambahan tentang aset..."
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </span>
                                ) : (
                                    mode === 'add' ? 'Tambah Aset' : 'Simpan Perubahan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
