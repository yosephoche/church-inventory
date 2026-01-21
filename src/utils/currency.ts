// Currency formatting utilities for IDR (Indonesian Rupiah)

/**
 * Format a number as IDR currency
 * @param amount - The amount to format
 * @returns Formatted string (e.g., "Rp 1.000.000")
 */
export function formatIDR(amount: number | null | undefined): string {
    if (amount === null || amount === undefined) {
        return 'Rp 0'
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Parse IDR input string to number
 * @param value - The string value to parse
 * @returns Parsed number
 */
export function parseIDR(value: string): number {
    // Remove all non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d]/g, '')
    return parseInt(cleaned, 10) || 0
}
