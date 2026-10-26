import { Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { IconButton } from '#/components/ui/IconButton'
import { useAppShell } from './AppShell'

type PageProps = {
  title: string
  subtitle?: ReactNode
  /** Page-level buttons in the top bar. */
  actions?: ReactNode
  children: ReactNode
}

/** Top bar + content area of a page inside the app shell. */
export function Page({ title, subtitle, actions, children }: PageProps) {
  const { openNavigation, topbarStart, topbarEnd } = useAppShell()

  return (
    <>
      <header className="border-line-soft bg-bg/95 sticky top-0 z-10 flex flex-col gap-3 border-b px-4 py-3 backdrop-blur sm:px-6 lg:min-h-[66px] lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:px-[26px] lg:py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-5">
          <IconButton
            label="Abrir menu"
            icon={<Menu size={16} aria-hidden />}
            onClick={openNavigation}
            className="lg:hidden"
          />
          <div className="min-w-0 flex-1 xl:flex-none">
            <h1 className="font-display truncate text-[17px] font-bold tracking-tight">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-muted truncate text-[11px]">{subtitle}</p>
            ) : null}
          </div>
          <div className="hidden min-w-0 flex-1 xl:block xl:max-w-[340px]">
            {topbarStart}
          </div>
          <div className="flex items-center gap-3 lg:hidden">{topbarEnd}</div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:gap-3">
          {actions}
          <div className="hidden items-center gap-3 lg:flex">{topbarEnd}</div>
        </div>
      </header>

      <main className="flex flex-col gap-4 p-4 sm:p-6 lg:p-[26px]">
        {children}
      </main>
    </>
  )
}
