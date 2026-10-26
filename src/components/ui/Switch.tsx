import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '#/lib/cn'

type SwitchProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  label: string
  description?: string
  /** `row`: text left, switch right (settings). `boxed`: switch first, mono label, framed (event lists). */
  layout?: 'row' | 'boxed'
}

const LAYOUT_CLASSES = {
  row: {
    wrapper: 'flex items-center justify-between gap-4',
    label: 'text-ink text-[13px] font-semibold',
  },
  boxed: {
    wrapper:
      'bg-canvas/40 border-line flex flex-row-reverse items-center justify-end gap-3 rounded-[10px] border px-3 py-2',
    label: 'text-ink-soft font-mono text-[11px]',
  },
} as const

/** A native checkbox with `role="switch"`: works in forms, resets and screen readers. */
export function Switch({
  label,
  description,
  layout = 'row',
  id,
  className,
  ...props
}: SwitchProps) {
  const generatedId = useId()
  const switchId = id ?? generatedId
  const descriptionId = `${switchId}-description`
  const classes = LAYOUT_CLASSES[layout]

  return (
    <div className={cn(classes.wrapper, className)}>
      <div className="flex min-w-0 flex-col gap-0.5">
        <label
          htmlFor={switchId}
          className={cn('cursor-pointer', classes.label)}
        >
          {label}
        </label>
        {description ? (
          <p id={descriptionId} className="text-dim text-[11px]">
            {description}
          </p>
        ) : null}
      </div>
      <input
        {...props}
        id={switchId}
        type="checkbox"
        role="switch"
        aria-describedby={description ? descriptionId : undefined}
        className="bg-line-strong checked:bg-lime focus-visible:ring-lime/25 before:bg-muted checked:before:bg-on-lime relative h-[22px] w-10 flex-none cursor-pointer appearance-none rounded-full transition before:absolute before:top-[3px] before:left-[3px] before:size-4 before:rounded-full before:transition checked:before:translate-x-[18px] focus-visible:ring-3 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45"
      />
    </div>
  )
}
