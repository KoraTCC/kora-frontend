import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

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
  return (
    <div className="bg-sidebar border-line-soft flex h-full flex-col gap-5 overflow-y-auto border-r px-4 py-[22px]">
      <div className="flex items-center gap-2 px-1.5">
        <p className="font-display text-ink text-[17px] font-bold tracking-tight">
          Kora
        </p>
        {brandTag}
      </div>

      {account}

      <nav aria-label="Principal" className="flex flex-1 flex-col gap-5">
        {sections.map((section) => (
          <div key={section.label} className="flex flex-col gap-[3px]">
            <p className="text-faint px-1.5 pb-1 font-mono text-[9px] font-medium tracking-[0.1em] uppercase">
              {section.label}
            </p>
            <ul className="flex flex-col gap-[3px]">
              {section.items.map((item) => (
                <li key={item.label}>
                  <SidebarLink item={item} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <ul className="border-line-soft flex flex-col gap-[3px] border-t pt-2.5">
        {footerItems.map((item) => (
          <li key={item.label}>
            <SidebarLink item={item} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </div>
  )
}

type SidebarLinkProps = {
  item: SidebarItem
  onNavigate?: () => void
}

function SidebarLink({ item, onNavigate }: SidebarLinkProps) {
  const Icon = item.icon
  const content = (
    <>
      <Icon size={16} aria-hidden className="flex-none" />
      <span className="flex-1 text-left">{item.label}</span>
      {item.indicator}
    </>
  )

  if (!item.to) {
    return (
      <button type="button" onClick={item.onClick} className={ITEM_CLASSES}>
        {content}
      </button>
    )
  }

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={ITEM_CLASSES}
      activeProps={ACTIVE_PROPS}
      activeOptions={{ exact: item.isExact ?? false }}
    >
      {content}
    </Link>
  )
}
