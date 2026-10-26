import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { Modal } from '#/components/ui/Modal'

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
 * Sidebar + content. From `lg` the sidebar is a sticky column; below it lives
 * in a drawer opened from the top bar.
 */
export function AppShell({
  renderSidebar,
  topbarStart,
  topbarEnd,
  children,
}: AppShellProps) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)

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
      <div className="bg-bg text-ink min-h-screen lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-screen lg:block">
          {renderSidebar()}
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
