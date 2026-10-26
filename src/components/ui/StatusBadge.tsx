import type { ReactNode } from 'react'

export type StatusTone =
  'pending' | 'detected' | 'confirmed' | 'expired' | 'partial' | 'failed'

type StatusBadgeProps = {
  tone: StatusTone
  /** Visible label — status never relies on color alone. */
  children: ReactNode
}

const TONE_CLASSES: Record<StatusTone, string> = {
  pending: 'text-status-pending border-status-pending-border',
  detected: 'text-status-detected border-status-detected-border',
  confirmed: 'text-status-confirmed border-status-confirmed-border',
  expired: 'text-status-expired border-status-expired-border',
  partial: 'text-status-partial border-status-partial-border',
  failed: 'text-status-failed border-status-failed-border',
}

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit flex-none items-center gap-[7px] rounded-[6px] border py-1 pr-[9px] pl-[7px] font-mono text-[10px] font-medium tracking-[0.06em] uppercase ${TONE_CLASSES[tone]}`}
    >
      <span aria-hidden className="size-[5px] rounded-full bg-current" />
      {children}
    </span>
  )
}
