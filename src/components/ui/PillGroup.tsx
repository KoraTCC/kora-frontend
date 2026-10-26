import { cn } from '#/lib/cn'

export type PillOption<TValue extends string> = {
  value: TValue
  label: string
}

type PillGroupProps<TValue extends string> = {
  /** Accessible name of the group. */
  label: string
  options: ReadonlyArray<PillOption<TValue>>
  value: TValue
  onChange: (value: TValue) => void
  /** `pills`: loose chips (filters). `segmented`: one joined control (24H · 7D · 30D). */
  variant?: 'pills' | 'segmented'
}

const VARIANT_CLASSES = {
  pills: {
    group: 'flex flex-wrap gap-2',
    option:
      'rounded-[6px] border px-2.5 py-1.5 data-[active=true]:bg-lime-bg data-[active=true]:border-lime-line data-[active=true]:text-lime bg-surface-2 border-line-strong text-muted hover:text-ink',
  },
  segmented: {
    group:
      'bg-surface-2 border-line inline-flex w-fit gap-0.5 rounded-[9px] border p-[3px]',
    option:
      'rounded-[7px] px-3 py-1 text-muted data-[active=true]:bg-canvas data-[active=true]:text-ink hover:text-ink',
  },
} as const

/** Single choice among a few options, shown at once. Arrow keys not required: each is a button. */
export function PillGroup<TValue extends string>({
  label,
  options,
  value,
  onChange,
  variant = 'pills',
}: PillGroupProps<TValue>) {
  const classes = VARIANT_CLASSES[variant]

  return (
    <div role="radiogroup" aria-label={label} className={classes.group}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          data-active={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            'focus-visible:ring-lime/25 inline-flex min-h-11 items-center justify-center font-mono text-[10px] font-medium whitespace-nowrap transition focus-visible:ring-3 focus-visible:outline-none lg:min-h-0',
            classes.option,
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
