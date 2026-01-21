'use client'

import { QRCodeSVG } from 'qrcode.react'
import type { Asset } from '@/types/asset'

interface QRCodeModalProps {
    isOpen: boolean
    onClose: () => void
    asset: Asset | null
}

export default function QRCodeModal({ isOpen, onClose, asset }: QRCodeModalProps) {
    if (!isOpen || !asset) return null

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
                    <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-display font-semibold text-gray-900">
                                QR Code Aset
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

                        <div className="text-center">
                            <div className="inline-block p-6 bg-white border-2 border-gray-100 rounded-xl shadow-warm">
                                <QRCodeSVG
                                    value={asset.id}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>

                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {asset.name}
                                </h4>
                                <p className="text-sm text-gray-500 font-mono mt-1">
                                    ID: {asset.id}
                                </p>
                            </div>

                            <div className="mt-6 flex justify-center space-x-3">
                                <button
                                    onClick={handlePrint}
                                    className="btn-primary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Cetak QR Code
                                </button>
                                <button
                                    onClick={onClose}
                                    className="btn-secondary"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Version */}
            <div className="print-only">
                <div className="print-container">
                    <div className="print-qr-wrapper">
                        <QRCodeSVG
                            value={asset.id}
                            size={300}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <p className="print-asset-name">{asset.name}</p>
                    <p className="print-asset-id">Asset ID: {asset.id}</p>
                </div>
            </div>
        </>
    )
}
