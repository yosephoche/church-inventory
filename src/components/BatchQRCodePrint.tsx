'use client'

import { QRCodeSVG } from 'qrcode.react'
import type { Asset } from '@/types/asset'

interface BatchQRCodePrintProps {
    isOpen: boolean
    onClose: () => void
    assets: Asset[]
}

export default function BatchQRCodePrint({ isOpen, onClose, assets }: BatchQRCodePrintProps) {
    if (!isOpen || assets.length === 0) return null

    const handlePrint = () => {
        window.print()
    }

    return (
        <>
            {/* Screen Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto no-print">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 transition-opacity bg-gray-900/50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="relative inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-display font-semibold text-gray-900">
                                    Cetak QR Code
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {assets.length} aset dipilih
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Preview Grid */}
                        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-4 bg-gray-50 rounded-xl">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {assets.map((asset) => (
                                    <div
                                        key={asset.id}
                                        className="bg-white p-4 rounded-lg shadow-warm-sm text-center"
                                    >
                                        <QRCodeSVG
                                            value={asset.id}
                                            size={120}
                                            level="H"
                                            includeMargin={true}
                                            className="mx-auto"
                                        />
                                        <p className="mt-2 text-sm font-medium text-gray-900 truncate">
                                            {asset.name}
                                        </p>
                                        <p className="text-xs text-gray-500 font-mono truncate">
                                            {asset.id.slice(0, 8)}...
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={onClose} className="btn-secondary">
                                Batal
                            </button>
                            <button onClick={handlePrint} className="btn-primary">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Cetak Semua ({assets.length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Version */}
            <div className="print-only print-batch-grid">
                {assets.map((asset) => (
                    <div key={asset.id} className="print-batch-item">
                        <QRCodeSVG
                            value={asset.id}
                            size={150}
                            level="H"
                            includeMargin={true}
                        />
                        <p style={{ marginTop: '10px', fontSize: '14px', fontWeight: 600 }}>
                            {asset.name}
                        </p>
                        <p style={{ marginTop: '4px', fontSize: '10px', color: '#666' }}>
                            {asset.id}
                        </p>
                    </div>
                ))}
            </div>
        </>
    )
}
