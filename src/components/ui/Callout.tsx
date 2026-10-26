import type { ReactNode } from 'react'

type CalloutTone = 'neutral' | 'warning'

type CalloutProps = {
  tone?: CalloutTone
  children: ReactNode
}

const TONE_CLASSES: Record<CalloutTone, { box: string; dot: string }> = {
  neutral: {
    box: 'bg-surface border-line-strong text-ink-soft',
    dot: 'bg-muted',
  },
  warning: {
    box: 'bg-status-pending-bg border-status-pending-border text-status-pending-soft',
    dot: 'bg-status-pending',
  },
}

/** Short inline notice with a leading dot — not an alert, just context. */
export function Callout({ tone = 'neutral', children }: CalloutProps) {
  const toneClasses = TONE_CLASSES[tone]

  return (
    <div
      className={`flex gap-2.5 rounded-[10px] border px-3.5 py-3 text-xs leading-[1.5] ${toneClasses.box}`}
    >
      <span
        aria-hidden
        className={`mt-1.5 size-1.5 flex-none rounded-full ${toneClasses.dot}`}
      />
      <p>{children}</p>
    </div>
  )
}
