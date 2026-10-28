import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Modal } from '#/components/ui/Modal'
import { cn } from '#/lib/cn'

type SidebarCollapseValue = {
  isCollapsed: boolean
  toggle: () => void
}

// Only the desktop column provides it: the mobile drawer is never collapsed.
const SidebarCollapseContext = createContext<SidebarCollapseValue | null>(null)

/** `null` when the sidebar cannot collapse (inside the mobile drawer). */
export function useSidebarCollapse(): SidebarCollapseValue | null {
  return useContext(SidebarCollapseContext)
}

const COLLAPSED_STORAGE_KEY = 'kora.sidebar.collapsed'

/** Remembers the choice in this browser; storage may be unavailable. */
function useCollapsedPreference() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Read after mount so the prerendered HTML and the first render match.
  useEffect(() => {
    try {
      setIsCollapsed(localStorage.getItem(COLLAPSED_STORAGE_KEY) === '1')
    } catch {
      // Private mode or blocked storage: keep it expanded.
    }
  }, [])

  function toggle() {
    setIsCollapsed((current) => {
      const next = !current
      try {
        localStorage.setItem(COLLAPSED_STORAGE_KEY, next ? '1' : '0')
      } catch {
        // Not persisted, but it still toggles for this visit.
      }
      return next
    })
  }

  return { isCollapsed, toggle }
}

type AppShellContextValue = {
  openNavigation: () => void
  /** Rendered by every page's top bar, before the page actions — a search box. */
  topbarStart?: ReactNode
  /** Rendered by every page's top bar, after the page actions — status, avatar. */
  topbarEnd?: ReactNode
}

const AppShellContext = createContext<AppShellContextValue | null>(null)

export function useAppShell(): AppShellContextValue {
  const context = useContext(AppShellContext)
  if (!context) throw new Error('useAppShell must be used inside <AppShell>')
  return context
}

type AppShellProps = {
  /** Receives `onNavigate` so the mobile drawer closes after a link is followed. */
  renderSidebar: (onNavigate?: () => void) => ReactNode
  topbarStart?: ReactNode
  topbarEnd?: ReactNode
  children: ReactNode
}

/**
 * Sidebar + content. From `lg` the sidebar is a sticky column that can be
 * collapsed to icons; below it lives in a drawer opened from the top bar.
 */
export function AppShell({
  renderSidebar,
  topbarStart,
  topbarEnd,
  children,
}: AppShellProps) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const collapse = useCollapsedPreference()

  function closeNavigation() {
    setIsNavigationOpen(false)
  }

  const contextValue: AppShellContextValue = {
    openNavigation: () => setIsNavigationOpen(true),
    topbarStart,
    topbarEnd,
  }

  return (
    <AppShellContext value={contextValue}>
      <div
        className={cn(
          'bg-bg text-ink min-h-screen transition-[grid-template-columns] duration-200 motion-reduce:transition-none lg:grid',
          collapse.isCollapsed
            ? 'lg:grid-cols-[68px_minmax(0,1fr)]'
            : 'lg:grid-cols-[236px_minmax(0,1fr)]',
        )}
      >
        <aside className="sticky top-0 hidden h-screen lg:block">
          <SidebarCollapseContext value={collapse}>
            {renderSidebar()}
          </SidebarCollapseContext>
        </aside>
        <div className="flex min-w-0 flex-col">{children}</div>
      </div>

      <Modal
        open={isNavigationOpen}
        onClose={closeNavigation}
        title="Menu"
        variant="drawer"
      >
        {renderSidebar(closeNavigation)}
      </Modal>
    </AppShellContext>
  )
}
