import { cn } from '#/lib/cn'

type AvatarProps = {
  initials: string
  tone?: 'lime' | 'neutral'
  /** Accessible name; omit when the name is already written next to it. */
  label?: string
}

const TONE_CLASSES = {
  lime: 'bg-lime text-on-lime',
  neutral: 'bg-surface-2 text-muted border-line-strong border',
} as const

export function Avatar({ initials, tone = 'lime', label }: AvatarProps) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        'inline-flex size-[34px] flex-none items-center justify-center rounded-full text-xs font-bold',
        TONE_CLASSES[tone],
      )}
    >
      {initials}
    </span>
  )
}
