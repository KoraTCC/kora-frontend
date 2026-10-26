import { Check } from 'lucide-react'
import { cn } from '#/lib/cn'

export type ChecklistItem = {
  id: string
  label: string
  isDone: boolean
}

type ChecklistProps = {
  items: ReadonlyArray<ChecklistItem>
}

/** Steps or recommendations; finished ones are struck through. */
export function Checklist({ items }: ChecklistProps) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-2.5 text-xs">
          <span
            aria-hidden
            className={cn(
              'flex size-4 flex-none items-center justify-center rounded-full border',
              item.isDone
                ? 'bg-lime border-lime text-on-lime'
                : 'border-lime-line',
            )}
          >
            {item.isDone ? <Check size={10} strokeWidth={3} /> : null}
          </span>
          <span
            className={cn(
              item.isDone ? 'text-dim line-through' : 'text-ink-soft',
            )}
          >
            {item.label}
            <span className="sr-only">
              {item.isDone ? ' (feito)' : ' (pendente)'}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}
