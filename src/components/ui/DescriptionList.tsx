import type { ReactNode } from 'react'
import { cn } from '#/lib/cn'

export type DescriptionTone = 'default' | 'positive' | 'warning' | 'danger'

export type DescriptionItem = {
  label: string
  value: ReactNode
  tone?: DescriptionTone
}

type DescriptionListProps = {
  items: ReadonlyArray<DescriptionItem>
}

const TONE_CLASSES: Record<DescriptionTone, string> = {
  default: 'text-ink-soft',
  positive: 'text-lime',
  warning: 'text-status-partial',
  danger: 'text-status-failed',
}

/** Label on the left, mono value on the right — summaries and facts. */
export function DescriptionList({ items }: DescriptionListProps) {
  return (
    <dl className="flex flex-col gap-2.5">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-baseline justify-between gap-4 text-xs"
        >
          <dt className="text-muted">{item.label}</dt>
          <dd
            className={cn(
              'min-w-0 truncate text-right font-mono',
              TONE_CLASSES[item.tone ?? 'default'],
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
