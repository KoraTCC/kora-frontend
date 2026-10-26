import { cn } from '#/lib/cn'
import type { StatusTone } from './StatusBadge'

export type DistributionItem = {
  id: string
  label: string
  share: number
  tone: StatusTone
}

type DistributionBarProps = {
  items: ReadonlyArray<DistributionItem>
  /** Formats a share for the legend — e.g. `62%`. */
  formatShare: (share: number) => string
}

const TONE_CLASSES: Record<StatusTone, string> = {
  pending: 'bg-status-pending',
  detected: 'bg-status-detected',
  confirmed: 'bg-status-confirmed',
  expired: 'bg-status-expired',
  partial: 'bg-status-partial',
  failed: 'bg-status-failed',
}

/** One bar split by share, with a legend that carries the numbers as text. */
export function DistributionBar({ items, formatShare }: DistributionBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div
        aria-hidden
        className="flex h-2 gap-0.5 overflow-hidden rounded-full"
      >
        {items.map((item) => (
          <span
            key={item.id}
            className={TONE_CLASSES[item.tone]}
            style={{ width: `${item.share * 100}%` }}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="text-ink-soft flex items-center gap-2">
              <span
                aria-hidden
                className={cn('size-1.5 rounded-full', TONE_CLASSES[item.tone])}
              />
              {item.label}
            </span>
            <span className="text-muted font-mono">
              {formatShare(item.share)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
