import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '#/lib/cn'
import { useSidebarCollapse } from './AppShell'

export type SidebarItem = {
  label: string
  icon: LucideIcon
  /** Route to open. Items without `to` are buttons (e.g. "Sair"). */
  to?: LinkProps['to']
  onClick?: () => void
  /** Right-aligned extra: a count, a status dot. */
  indicator?: ReactNode
  /** Active only on this exact path, not on its children (e.g. an index page). */
  isExact?: boolean
}

export type SidebarSection = {
  label: string
  items: ReadonlyArray<SidebarItem>
}

type SidebarProps = {
  /** Shown next to the brand — e.g. an "ADMIN" tag. */
  brandTag?: ReactNode
  account: ReactNode
  sections: ReadonlyArray<SidebarSection>
  footerItems: ReadonlyArray<SidebarItem>
  onNavigate?: () => void
}

const ITEM_CLASSES =
  'text-muted hover:text-ink focus-visible:ring-lime/25 flex min-h-11 w-full items-center gap-2.5 rounded-[10px] border border-transparent px-[11px] text-[13px] transition focus-visible:ring-3 focus-visible:outline-none lg:min-h-9'

const ACTIVE_PROPS = {
  className: 'bg-surface-2 border-line-strong text-ink font-semibold',
}

export function Sidebar({
  brandTag,
  account,
  sections,
  footerItems,
  onNavigate,
}: SidebarProps) {
  const collapse = useSidebarCollapse()
  const isCollapsed = collapse?.isCollapsed ?? false

  return (
    <div
      className={cn(
        'bg-sidebar border-line-soft flex h-full flex-col gap-5 overflow-x-hidden overflow-y-auto border-r py-[22px]',
        isCollapsed ? 'px-2.5' : 'px-4',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2',
          isCollapsed ? 'flex-col' : 'px-1.5',
        )}
      >
        <p className="font-display text-ink text-[17px] font-bold tracking-tight">
          {isCollapsed ? 'K' : 'Kora'}
        </p>
        {isCollapsed ? null : brandTag}
        {collapse ? (
          <button
            type="button"
            onClick={collapse.toggle}
            aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
            aria-expanded={!isCollapsed}
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
            className={cn(
              'text-muted hover:text-ink focus-visible:ring-lime/25 flex size-8 flex-none items-center justify-center rounded-[8px] transition focus-visible:ring-3 focus-visible:outline-none',
              !isCollapsed && 'ml-auto',
            )}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={16} aria-hidden />
            ) : (
              <PanelLeftClose size={16} aria-hidden />
            )}
          </button>
        ) : null}
      </div>

      {isCollapsed ? null : account}

      <nav aria-label="Principal" className="flex flex-1 flex-col gap-5">
        {sections.map((section) => (
          <div key={section.label} className="flex flex-col gap-[3px]">
            {isCollapsed ? (
              <span aria-hidden className="border-line-soft mx-2 border-t" />
            ) : (
              <p className="text-faint px-1.5 pb-1 font-mono text-[9px] font-medium tracking-[0.1em] uppercase">
                {section.label}
              </p>
            )}
            <ul className="flex flex-col gap-[3px]">
              {section.items.map((item) => (
                <li key={item.label}>
                  <SidebarLink
                    item={item}
                    onNavigate={onNavigate}
                    isCollapsed={isCollapsed}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <ul className="border-line-soft flex flex-col gap-[3px] border-t pt-2.5">
        {footerItems.map((item) => (
          <li key={item.label}>
            <SidebarLink
              item={item}
              onNavigate={onNavigate}
              isCollapsed={isCollapsed}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

type SidebarLinkProps = {
  item: SidebarItem
  onNavigate?: () => void
  /** Icon only; the label stays available to screen readers and as a tooltip. */
  isCollapsed?: boolean
}

function SidebarLink({
  item,
  onNavigate,
  isCollapsed = false,
}: SidebarLinkProps) {
  const Icon = item.icon
  const className = cn(ITEM_CLASSES, isCollapsed && 'justify-center px-0')
  const title = isCollapsed ? item.label : undefined
  const content = (
    <>
      <Icon size={16} aria-hidden className="flex-none" />
      <span className={isCollapsed ? 'sr-only' : 'flex-1 text-left'}>
        {item.label}
      </span>
      {isCollapsed ? null : item.indicator}
    </>
  )

  if (!item.to) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className={className}
        title={title}
      >
        {content}
      </button>
    )
  }

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      title={title}
      className={className}
      activeProps={ACTIVE_PROPS}
      activeOptions={{ exact: item.isExact ?? false }}
    >
      {content}
    </Link>
  )
}
