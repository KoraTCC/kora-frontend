import type { ReactNode } from 'react'
import { cn } from '#/lib/cn'

export type TimelineState = 'done' | 'current' | 'pending'

export type TimelineItem = {
  id: string
  title: ReactNode
  meta?: ReactNode
  state: TimelineState
}

type TimelineProps = {
  items: ReadonlyArray<TimelineItem>
}

const DOT_CLASSES: Record<TimelineState, string> = {
  done: 'bg-lime',
  current: 'bg-lime ring-lime/20 ring-4',
  pending: 'bg-line-strong',
}

const TITLE_CLASSES: Record<TimelineState, string> = {
  done: 'text-ink',
  current: 'text-ink',
  pending: 'text-muted',
}

export function Timeline({ items }: TimelineProps) {
  return (
    <ol className="flex flex-col">
      {items.map((item) => (
        <li
          key={item.id}
          className="relative flex gap-3.5 pb-5 last:pb-0 [&:last-child>span:first-child]:hidden"
        >
          <span
            aria-hidden
            className="bg-line-strong absolute top-3 bottom-0 left-[5px] w-0.5"
          />
          <span
            aria-hidden
            className={cn(
              'relative mt-1 size-3 flex-none rounded-full',
              DOT_CLASSES[item.state],
            )}
          />
          <div className="flex min-w-0 flex-col gap-1">
            <p className={cn('text-[13px]', TITLE_CLASSES[item.state])}>
              {item.title}
            </p>
            {item.meta ? (
              <p className="text-dim truncate font-mono text-[10px]">
                {item.meta}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
