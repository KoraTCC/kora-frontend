import { useCopyToClipboard } from '#/hooks/useCopyToClipboard'
import type { CopyState } from '#/hooks/useCopyToClipboard'

type CopyFieldProps = {
  /** What goes to the clipboard. */
  value: string
  /** What is shown — e.g. a masked secret. Defaults to `value`. */
  displayValue?: string
  /** Accessible name — "Endereço de recebimento". */
  label: string
}

const COPY_LABELS: Record<CopyState, string> = {
  idle: 'Copiar',
  copied: 'Copiado',
  failed: 'Falhou',
}

/** Address, hash or key with a copy action. Long values truncate at the end. */
export function CopyField({ value, displayValue, label }: CopyFieldProps) {
  const { state, copy } = useCopyToClipboard()

  return (
    <div className="bg-surface border-line flex min-w-0 items-center gap-2.5 rounded-[10px] border py-1 pr-1 pl-[13px]">
      <p className="text-ink-soft min-w-0 flex-1 truncate font-mono text-xs">
        {displayValue ?? value}
      </p>
      <button
        type="button"
        onClick={() => void copy(value)}
        aria-label={`${COPY_LABELS[state]}: ${label}`}
        className="text-lime hover:text-lime-soft min-h-11 flex-none rounded-[7px] px-2.5 font-mono text-[10px] font-medium lg:min-h-9"
      >
        <span aria-live="polite">{COPY_LABELS[state]}</span>
      </button>
    </div>
  )
}
