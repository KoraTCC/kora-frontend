import { useId } from 'react'
import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from 'react'

/** Characters each kind of field accepts — typing anything else is ignored. */
export const INPUT_ALLOW = {
  money: /[\d.,]/,
  digits: /\d/,
  phone: /[\d()+\-\s]/,
  document: /[\d./-]/,
  postalCode: /[\d-]/,
  walletAddress: /[A-Za-z0-9]/,
  reference: /[\w\-./#]/,
} as const

/** Fallbacks so no field is unbounded; pass `maxLength` for a tighter limit. */
const DEFAULT_MAX_LENGTH = 255
const EMAIL_MAX_LENGTH = 254

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string
  /** Ação alinhada à direita do label — ex.: "Esqueci a senha". */
  labelAction?: ReactNode
  /** Conteúdo dentro do campo, encostado à direita — ex.: "Mostrar". */
  trailing?: ReactNode
  error?: string
  hint?: string
  /** Keeps the label for screen readers only — search boxes, filter bars. */
  isLabelHidden?: boolean
  /** Allowed characters, one at a time — see `INPUT_ALLOW`. */
  allow?: RegExp
  /** Reformats the whole value on every change — e.g. `maskMoney`. */
  mask?: (value: string) => string
}

export function Input({
  label,
  labelAction,
  trailing,
  error,
  hint,
  isLabelHidden = false,
  allow,
  mask,
  maxLength,
  onChange,
  id,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const helperText = error ?? hint
  const helperClasses = error ? 'text-danger text-xs' : 'text-dim text-[11px]'
  // Filters and masks typed and pasted text; works for controlled and
  // uncontrolled fields.
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    let next = input.value
    if (allow) {
      next = Array.from(next)
        .filter((char) => allow.test(char))
        .join('')
    }
    if (mask) next = mask(next)
    if (next !== input.value) input.value = next
    onChange?.(event)
  }

  const labelClasses = isLabelHidden
    ? 'sr-only'
    : 'text-muted text-xs font-semibold'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
        {labelAction}
      </div>

      <div className="border-line bg-surface focus-within:border-lime-line focus-within:ring-lime/12 flex items-center gap-2 rounded-[10px] border px-3.5 py-[13px] transition focus-within:ring-3">
        <input
          {...props}
          maxLength={
            maxLength ??
            (props.type === 'email' ? EMAIL_MAX_LENGTH : DEFAULT_MAX_LENGTH)
          }
          onChange={handleChange}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={helperText ? errorId : undefined}
          className={`text-ink placeholder:text-dim min-w-0 flex-1 bg-transparent text-sm outline-none ${className}`}
        />
        {trailing}
      </div>

      {helperText ? (
        <p id={errorId} className={helperClasses}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
