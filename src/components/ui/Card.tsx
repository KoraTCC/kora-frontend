import type { ReactNode } from 'react'
import { cn } from '#/lib/cn'

export type CardTone = 'default' | 'accent' | 'warning' | 'danger'

type CardProps = {
  title?: ReactNode
  /** Right side of the header — a link, a filter, a count. */
  action?: ReactNode
  tone?: CardTone
  /** `flush` drops the body padding, for tables and lists that bleed to the edge. */
  isFlush?: boolean
  children: ReactNode
  className?: string
}

const TONE_CLASSES: Record<CardTone, string> = {
  default: 'border-line',
  accent: 'border-status-confirmed-border',
  warning: 'border-status-partial-border',
  danger: 'border-status-failed-border',
}

export function Card({
  title,
  action,
  tone = 'default',
  isFlush = false,
  children,
  className,
}: CardProps) {
  const hasHeader = Boolean(title) || Boolean(action)

  return (
    <section
      className={cn(
        'bg-surface flex min-w-0 flex-col rounded-[14px] border',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {hasHeader ? (
        <header
          className={cn(
            'flex min-h-12 flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 pt-4 sm:px-[18px]',
            isFlush && 'border-line-soft border-b pb-3',
          )}
        >
          <h2 className="text-ink text-[13px] font-semibold">{title}</h2>
          {action}
        </header>
      ) : null}
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          !isFlush && 'gap-3 p-4 sm:px-[18px]',
          !isFlush && hasHeader && 'pt-3',
        )}
      >
        {children}
      </div>
    </section>
  )
}
