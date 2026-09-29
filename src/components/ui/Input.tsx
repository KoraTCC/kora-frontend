import { useId } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string
  /** Ação alinhada à direita do label — ex.: "Esqueci a senha". */
  labelAction?: ReactNode
  /** Conteúdo dentro do campo, encostado à direita — ex.: "Mostrar". */
  trailing?: ReactNode
  error?: string
}

export function Input({
  label,
  labelAction,
  trailing,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-muted text-xs font-semibold">
          {label}
        </label>
        {labelAction}
      </div>

      <div className="border-line bg-surface focus-within:border-lime-line focus-within:ring-lime/12 flex items-center gap-2 rounded-[10px] border px-3.5 py-[13px] transition focus-within:ring-3">
        <input
          {...props}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`text-ink placeholder:text-dim min-w-0 flex-1 bg-transparent text-sm outline-none ${className}`}
        />
        {trailing}
      </div>

      {error ? (
        <p id={errorId} className="text-danger text-xs">
          {error}
        </p>
      ) : null}
    </div>
  )
}
