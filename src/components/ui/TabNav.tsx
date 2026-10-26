import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'

export type TabNavItem = {
  label: string
  to: LinkProps['to']
}

type TabNavProps = {
  /** Accessible name of the navigation. */
  label: string
  items: ReadonlyArray<TabNavItem>
}

/** Tabs that are routes: the URL is the selected tab, so it can be shared. */
export function TabNav({ label, items }: TabNavProps) {
  return (
    <nav aria-label={label} className="w-full overflow-x-auto">
      <ul className="bg-surface border-line flex w-max gap-1 rounded-[11px] border p-1">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to}
              className="text-muted hover:text-ink flex min-h-11 items-center rounded-[8px] border border-transparent px-3.5 text-[13px] whitespace-nowrap transition lg:min-h-9"
              activeProps={{
                'aria-current': 'page',
                className: 'bg-surface-2 border-line-strong text-ink',
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
