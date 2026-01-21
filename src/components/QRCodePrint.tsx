import { QRCodeSVG } from 'qrcode.react'

interface QRCodePrintProps {
    assetId: string
    assetName?: string
}

export default function QRCodePrint({ assetId, assetName }: QRCodePrintProps) {
    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="mt-6">
            {/* Display version - shown on screen */}
            <div className="no-print bg-white border-2 border-primary-500 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    QR Code Generated
                </h3>

                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                        <QRCodeSVG
                            value={assetId}
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                </div>

                {assetName && (
                    <p className="text-sm font-medium text-gray-700 mb-1">
                        {assetName}
                    </p>
                )}
                <p className="text-xs text-gray-500 mb-4">ID: {assetId}</p>

                <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                    </svg>
                    Print QR Code
                </button>
            </div>

            {/* Print version - only shown when printing */}
            <div className="print-only">
                <div className="print-container">
                    <div className="print-qr-wrapper">
                        <QRCodeSVG
                            value={assetId}
                            size={300}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    {assetName && (
                        <p className="print-asset-name">{assetName}</p>
                    )}
                    <p className="print-asset-id">Asset ID: {assetId}</p>
                </div>
            </div>
        </div>
    )
}
