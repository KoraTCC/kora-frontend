import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  label: string
  error?: string
  /** Keeps the label for screen readers only — row selection in tables. */
  isLabelHidden?: boolean
}

export function Checkbox({
  label,
  error,
  isLabelHidden = false,
  id,
  ...props
}: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  const errorId = `${checkboxId}-error`
  const labelClasses = isLabelHidden
    ? 'sr-only'
    : 'text-ink-soft cursor-pointer text-[13px]'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2.5">
        <input
          {...props}
          id={checkboxId}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="border-line-strong bg-surface checked:border-lime checked:bg-lime focus-visible:ring-lime/25 h-[18px] w-[18px] flex-none cursor-pointer appearance-none rounded-[5px] border transition checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 12%22><path fill=%22%230A0C0A%22 d=%22M4.7 9 1.5 5.8l1.1-1.1 2.1 2.1 4.7-4.7 1.1 1.1z%22/></svg>')] checked:bg-center checked:bg-no-repeat focus-visible:ring-3 focus-visible:outline-none"
        />
        <label htmlFor={checkboxId} className={labelClasses}>
          {label}
        </label>
      </div>
      {error ? (
        <p id={errorId} className="text-danger text-xs">
          {error}
        </p>
      ) : null}
    </div>
  )
}
