import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '#/lib/cn'

type IconButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  /** Accessible name — the icon alone says nothing to a screen reader. */
  label: string
  icon: ReactNode
}

/** 44px touch target on mobile, compact square from `lg` up. */
export const iconButtonClasses =
  'border-line bg-surface text-muted hover:text-ink focus-visible:ring-lime/25 inline-flex size-11 flex-none items-center justify-center rounded-[9px] border transition focus-visible:ring-3 focus-visible:outline-none lg:size-[34px]'

export function IconButton({
  label,
  icon,
  type = 'button',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-label={label}
      className={cn(iconButtonClasses, className)}
    >
      {icon}
    </button>
  )
}
