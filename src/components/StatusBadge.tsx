import { STATUS_COLORS } from '@/utils/constants'

interface StatusBadgeProps {
    status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const colors = STATUS_COLORS[status] || STATUS_COLORS['Terpakai']

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
        >
            {status}
        </span>
    )
}
