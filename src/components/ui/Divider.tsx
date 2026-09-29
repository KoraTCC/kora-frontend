import type { ReactNode } from 'react'

type DividerProps = {
  children?: ReactNode
}

export function Divider({ children }: DividerProps) {
  if (!children) {
    return <hr className="border-line-soft border-t" />
  }

  return (
    <div className="flex items-center gap-3">
      <span className="bg-line-soft h-px flex-1" />
      <span className="text-faint text-[11px]">{children}</span>
      <span className="bg-line-soft h-px flex-1" />
    </div>
  )
}
