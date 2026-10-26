import type { ReactNode } from 'react'
import { cn } from '#/lib/cn'

type AuthHeadingProps = {
  title: string
  description: ReactNode
  align?: 'start' | 'center'
}

export function AuthHeading({
  title,
  description,
  align = 'start',
}: AuthHeadingProps) {
  return (
    <div
      className={cn('flex flex-col gap-2', align === 'center' && 'text-center')}
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-[28px]">
        {title}
      </h2>
      <p className="text-muted text-[13px] leading-normal">{description}</p>
    </div>
  )
}
