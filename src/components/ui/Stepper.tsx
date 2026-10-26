import { Check } from 'lucide-react'
import { cn } from '#/lib/cn'

type StepperProps = {
  /** Accessible name — "Etapas do pagamento". */
  label: string
  steps: ReadonlyArray<string>
  /** Index of the step in progress; earlier ones are done. */
  current: number
}

/** Horizontal progress through fixed steps. */
export function Stepper({ label, steps, current }: StepperProps) {
  const items = steps.map((step, index) => ({
    step,
    number: index + 1,
    isDone: index < current,
    isCurrent: index === current,
  }))

  return (
    <ol aria-label={label} className="flex items-start">
      {items.map((item) => (
        <li
          key={item.step}
          aria-current={item.isCurrent ? 'step' : undefined}
          className="relative flex flex-1 flex-col items-center gap-2 text-center [&:not(:first-child)]:before:absolute [&:not(:first-child)]:before:top-[9px] [&:not(:first-child)]:before:right-[calc(50%+16px)] [&:not(:first-child)]:before:left-[calc(-50%+16px)] [&:not(:first-child)]:before:h-px [&:not(:first-child)]:before:bg-line-strong"
        >
          <span
            className={cn(
              'flex size-5 items-center justify-center rounded-full font-mono text-[10px]',
              item.isDone || item.isCurrent
                ? 'bg-lime text-on-lime'
                : 'bg-surface-2 border-line-strong text-dim border',
            )}
          >
            {item.isDone ? (
              <Check size={11} strokeWidth={3} aria-hidden />
            ) : (
              item.number
            )}
          </span>
          <span
            className={cn(
              'text-[11px]',
              item.isCurrent ? 'text-ink' : 'text-muted',
            )}
          >
            {item.step}
          </span>
        </li>
      ))}
    </ol>
  )
}
