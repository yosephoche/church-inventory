'use client'

interface BulkActionsToolbarProps {
    selectedCount: number
    onPrintQR: () => void
    onDelete: () => void
    onCancel: () => void
}

export default function BulkActionsToolbar({
    selectedCount,
    onPrintQR,
    onDelete,
    onCancel,
}: BulkActionsToolbarProps) {
    if (selectedCount === 0) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:left-64 animate-slide-up">
            <div className="max-w-4xl mx-auto px-4 pb-4">
                <div className="bg-white rounded-2xl shadow-warm-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-700 font-bold">{selectedCount}</span>
                            </div>
                            <span className="text-gray-700 font-medium">
                                item dipilih
                            </span>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* Print QR Button */}
                            <button
                                onClick={onPrintQR}
                                className="btn bg-primary-50 text-primary-700 hover:bg-primary-100"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                                Cetak QR Code
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={onDelete}
                                className="btn bg-red-50 text-red-700 hover:bg-red-100"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Hapus
                            </button>

                            {/* Cancel Button */}
                            <button onClick={onCancel} className="btn-ghost">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
