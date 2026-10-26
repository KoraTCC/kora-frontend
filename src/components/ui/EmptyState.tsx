import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <p className="text-ink text-[13px] font-semibold">{title}</p>
      {description ? (
        <p className="text-muted max-w-80 text-xs">{description}</p>
      ) : null}
      {action}
    </div>
  )
}
