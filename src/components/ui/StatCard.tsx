import type { ReactNode } from 'react'
import { Card } from './Card'
import type { CardTone } from './Card'
import type { StatusTone } from './StatusBadge'

export type StatHintTone = 'muted' | 'positive' | 'warning' | 'danger'

type StatCardProps = {
  label: string
  value: ReactNode
  /** Small suffix next to the value — `min`, `ms`. */
  unit?: string
  hint?: ReactNode
  hintTone?: StatHintTone
  /** Status dot before the label. */
  dot?: StatusTone
  tone?: CardTone
}

const HINT_CLASSES: Record<StatHintTone, string> = {
  muted: 'text-muted',
  positive: 'text-lime',
  warning: 'text-status-partial',
  danger: 'text-status-failed',
}

const DOT_CLASSES: Record<StatusTone, string> = {
  pending: 'bg-status-pending',
  detected: 'bg-status-detected',
  confirmed: 'bg-status-confirmed',
  expired: 'bg-status-expired',
  partial: 'bg-status-partial',
  failed: 'bg-status-failed',
}

/** KPI tile: label, big value, one line of context. */
export function StatCard({
  label,
  value,
  unit,
  hint,
  hintTone = 'muted',
  dot,
  tone,
}: StatCardProps) {
  return (
    <Card tone={tone}>
      <p className="text-muted flex items-center gap-2 text-xs font-semibold">
        {dot ? (
          <span
            aria-hidden
            className={`size-2 flex-none rounded-full ${DOT_CLASSES[dot]}`}
          />
        ) : null}
        {label}
      </p>
      <p className="font-display text-ink text-[28px] leading-none font-bold tracking-tight sm:text-[34px]">
        {value}
        {unit ? (
          <span className="text-muted ml-0.5 text-sm font-semibold">
            {unit}
          </span>
        ) : null}
      </p>
      {hint ? (
        <p className={`text-[11px] ${HINT_CLASSES[hintTone]}`}>{hint}</p>
      ) : null}
    </Card>
  )
}
