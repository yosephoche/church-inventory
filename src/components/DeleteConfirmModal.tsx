'use client'

interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    isDeleting?: boolean
    itemCount?: number
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isDeleting = false,
    itemCount = 1,
}: DeleteConfirmModalProps) {
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
                <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl animate-scale-in">
                    <div className="flex items-start space-x-4">
                        {/* Warning Icon */}
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-lg font-display font-semibold text-gray-900">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                {message}
                            </p>
                            {itemCount > 1 && (
                                <p className="mt-2 text-sm font-medium text-red-600">
                                    {itemCount} item akan dihapus secara permanen.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="btn-secondary"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="btn-danger"
                        >
                            {isDeleting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menghapus...
                                </span>
                            ) : (
                                'Hapus'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
