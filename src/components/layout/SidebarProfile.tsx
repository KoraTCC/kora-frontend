import type { ReactNode } from 'react'
import { Avatar } from '#/components/ui/Avatar'
import { SkeletonBox } from '#/components/ui/Skeleton'
import { cn } from '#/lib/cn'
import { useSidebarCollapse } from './AppShell'

type SidebarProfileProps = {
  /** `undefined` while the session is still loading. */
  name?: string
  /** Second line — an e-mail, a role. */
  detail?: string
  initials: string
  /** Small buttons on the right: theme, sign out. */
  actions?: ReactNode
}

/** The signed-in person at the bottom of the sidebar, with quick actions. */
export function SidebarProfile({
  name,
  detail,
  initials,
  actions,
}: SidebarProfileProps) {
  const collapse = useSidebarCollapse()
  const isCollapsed = collapse?.isCollapsed ?? false

  if (!name) return <SidebarProfileSkeleton isCollapsed={isCollapsed} />

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-2" title={name}>
        {actions}
        <Avatar initials={initials} label={name} />
      </div>
    )
  }

  return (
    <div className="bg-surface border-line flex items-center gap-2.5 rounded-[12px] border p-2.5">
      <Avatar initials={initials} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-ink truncate text-xs font-semibold">{name}</p>
        {detail ? (
          <p className="text-muted truncate font-mono text-[10px]">{detail}</p>
        ) : null}
      </div>
      <div className="flex flex-none items-center gap-1">{actions}</div>
    </div>
  )
}

function SidebarProfileSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5',
        isCollapsed ? 'justify-center' : 'p-2.5',
      )}
    >
      <SkeletonBox className="size-[34px] flex-none rounded-full" />
      {isCollapsed ? null : <SkeletonBox className="h-3 flex-1" />}
    </div>
  )
}
