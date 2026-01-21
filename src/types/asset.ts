// Status options (Indonesian)
export type AssetStatus = 'Terpakai' | 'Tidak Terpakai' | 'Rusak' | 'Perbaikan'

// Location options
export type AssetLocation = 'Panggung' | 'Lemari' | 'Box'

export interface Asset {
    id: string
    name: string
    specification: string | null
    purchase_date: string | null
    price: number | null
    notes: string | null
    qrcode_url: string | null
    status: AssetStatus
    location: AssetLocation | null
    location_detail: string | null
    created_at: string
    updated_at: string
}

export interface AssetFormInput {
    name: string
    specification?: string
    purchase_date?: string
    price?: number
    notes?: string
    status: AssetStatus
    location?: AssetLocation
    location_detail?: string
}
