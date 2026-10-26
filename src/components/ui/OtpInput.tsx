import { useEffect, useId, useRef } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import { cn } from '#/lib/cn'

type OtpInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  length?: number
  error?: string
  autoFocus?: boolean
  disabled?: boolean
}

const DIGITS_ONLY = /\D/g

/**
 * One cell per digit, filled left to right. Typing advances, Backspace goes
 * back and pasting the whole code fills every cell at once.
 */
export function OtpInput({
  label,
  value,
  onChange,
  length = 6,
  error,
  autoFocus,
  disabled,
}: OtpInputProps) {
  const labelId = useId()
  const errorId = useId()
  const cellRefs = useRef<Array<HTMLInputElement | null>>([])
  // Set while we move focus ourselves: `value` is stale until the parent
  // re-renders, so the "jump to first empty cell" rule must not run then.
  const isMovingFocusRef = useRef(false)
  const cells = Array.from({ length }, (_, index) => value.charAt(index))

  // A rejected code usually comes back after focus left the cells (e.g. the
  // submit button): bring it back so the user can retype right away.
  useEffect(() => {
    if (!error) return
    cellRefs.current[Math.min(value.length, length - 1)]?.focus()
  }, [error, value.length, length])

  function focusCell(index: number) {
    const target = Math.min(Math.max(index, 0), length - 1)
    isMovingFocusRef.current = true
    cellRefs.current[target]?.focus()
    isMovingFocusRef.current = false
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(DIGITS_ONLY, '')
    if (!digits) return

    const next = (value.slice(0, index) + digits).slice(0, length)
    onChange(next)
    focusCell(next.length)
  }

  function handleKeyDown(
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === 'ArrowLeft') return focusCell(index - 1)
    if (event.key === 'ArrowRight') return focusCell(index + 1)
    if (event.key !== 'Backspace') return

    event.preventDefault()
    const hasDigit = Boolean(cells[index])
    const removeFrom = hasDigit ? index : index - 1
    if (removeFrom < 0) return

    onChange(value.slice(0, removeFrom))
    focusCell(removeFrom)
  }

  // Cells fill in order: focusing past the first empty one jumps back to it.
  function handleFocus(index: number) {
    if (!isMovingFocusRef.current && index > value.length)
      return focusCell(value.length)
    cellRefs.current[index]?.select()
  }

  return (
    <div className="flex flex-col gap-2.5">
      <p
        id={labelId}
        className="text-dim text-center font-mono text-[10px] font-medium tracking-[0.08em] uppercase"
      >
        {label}
      </p>

      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        className="flex justify-center gap-2"
      >
        {cells.map((digit, index) => (
          <input
            // Cells are positional and never reorder: the position is the identity.
            key={`digit-${index}`}
            ref={(element) => {
              cellRefs.current[index] = element
            }}
            value={digit}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onFocus={() => handleFocus(index)}
            aria-label={`Dígito ${index + 1} de ${length}`}
            aria-invalid={Boolean(error)}
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            autoFocus={autoFocus && index === 0}
            // Lets a parent <Modal> hand initial focus to the first cell.
            data-autofocus={autoFocus && index === 0 ? '' : undefined}
            disabled={disabled}
            className={cn(
              'text-ink focus:border-lime-line focus:ring-lime/12 h-14 w-full max-w-[52px] min-w-0 flex-1 rounded-[11px] border text-center font-mono text-2xl transition outline-none focus:ring-3 disabled:opacity-45 sm:h-[62px] sm:text-[26px]',
              digit
                ? 'bg-surface border-line-strong'
                : 'bg-raised border-line-soft',
              error && 'border-danger',
            )}
          />
        ))}
      </div>

      {error ? (
        <p id={errorId} className="text-danger text-center text-xs">
          {error}
        </p>
      ) : null}
    </div>
  )
}
