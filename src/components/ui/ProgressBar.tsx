import { cn } from '#/lib/cn'

export type ProgressTone = 'lime' | 'deep' | 'pending' | 'warning' | 'danger'

type ProgressBarProps = {
  /** 0 to 1. */
  value: number
  /** Accessible name — what is being measured. */
  label: string
  tone?: ProgressTone
  size?: 'sm' | 'md'
}

const TONE_CLASSES: Record<ProgressTone, string> = {
  lime: 'bg-lime',
  deep: 'bg-lime-deep',
  pending: 'bg-status-pending',
  warning: 'bg-status-partial',
  danger: 'bg-status-failed',
}

export function ProgressBar({
  value,
  label,
  tone = 'lime',
  size = 'sm',
}: ProgressBarProps) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cn(
        'bg-line w-full overflow-hidden rounded-full',
        size === 'sm' ? 'h-1' : 'h-1.5',
      )}
    >
      <div
        className={cn('h-full rounded-full transition-all', TONE_CLASSES[tone])}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
