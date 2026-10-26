import { ChevronDown } from 'lucide-react'
import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '#/lib/cn'

export type SelectOption = {
  value: string
  label: string
}

type SelectProps = Omit<
  ComponentPropsWithoutRef<'select'>,
  'children' | 'size'
> & {
  label: string
  options: ReadonlyArray<SelectOption>
  hint?: string
  error?: string
  /** Keeps the label for screen readers only — compact filter bars. */
  isLabelHidden?: boolean
  /** `sm` fits card headers and toolbars. */
  size?: 'md' | 'sm'
}

const SIZE_CLASSES = {
  md: 'h-11 text-sm lg:h-12',
  sm: 'h-11 font-mono text-[11px] lg:h-8',
} as const

export function Select({
  label,
  options,
  hint,
  error,
  isLabelHidden = false,
  size = 'md',
  id,
  className,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const hintId = `${selectId}-hint`
  const helperText = error ?? hint
  const helperClasses = error ? 'text-danger text-xs' : 'text-dim text-[11px]'

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <label
        htmlFor={selectId}
        className={cn(
          'text-muted text-xs font-semibold',
          isLabelHidden && 'sr-only',
        )}
      >
        {label}
      </label>
      <div className="relative">
        <select
          {...props}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={helperText ? hintId : undefined}
          className={cn(
            'border-line bg-surface text-ink focus:border-lime-line focus:ring-lime/12 w-full min-w-0 cursor-pointer appearance-none rounded-[10px] border pr-9 pl-3.5 transition outline-none focus:ring-3',
            SIZE_CLASSES[size],
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          aria-hidden
          className="text-dim pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2"
        />
      </div>
      {helperText ? (
        <p id={hintId} className={helperClasses}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
