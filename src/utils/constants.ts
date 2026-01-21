// Application constants

// Status options (Indonesian)
export const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'Terpakai', label: 'Terpakai' },
    { value: 'Tidak Terpakai', label: 'Tidak Terpakai' },
    { value: 'Rusak', label: 'Rusak' },
    { value: 'Perbaikan', label: 'Perbaikan' },
]

// Location options
export const LOCATION_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'Panggung', label: 'Panggung' },
    { value: 'Lemari', label: 'Lemari' },
    { value: 'Box', label: 'Box' },
]

// Status color mappings for badges
export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Terpakai': {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
    },
    'Tidak Terpakai': {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
    },
    'Rusak': {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
    },
    'Perbaikan': {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
    },
}
