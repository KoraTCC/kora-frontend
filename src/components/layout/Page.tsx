import { Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { IconButton } from '#/components/ui/IconButton'
import { LoadingBar } from '#/components/ui/LoadingBar'
import { useAppShell } from './AppShell'

type PageProps = {
  title: string
  subtitle?: ReactNode
  /** Page-level buttons, next to the search. */
  actions?: ReactNode
  children: ReactNode
}

/** Same max width for the header and the content, so they line up. */
const COLUMN_CLASSES = 'mx-auto w-full max-w-[1240px]'

/**
 * Page header + content inside the app shell. The header sits on the page
 * background (no bar): title and subtitle on the left, search and the page
 * actions on the right.
 */
export function Page({ title, subtitle, actions, children }: PageProps) {
  const { openNavigation, topbarStart, topbarEnd } = useAppShell()
  const fetchingCount = useIsFetching()
  const isRoutePending = useRouterState({
    select: (state) => state.status === 'pending',
  })
  const isLoading = fetchingCount > 0 || isRoutePending

  return (
    <>
      <header className="bg-canvas/90 sticky top-0 z-10 px-4 pt-4 pb-3 backdrop-blur sm:px-6 lg:px-8 lg:pt-7 lg:pb-4">
        <div
          className={`${COLUMN_CLASSES} flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <IconButton
              label="Abrir menu"
              icon={<Menu size={16} aria-hidden />}
              onClick={openNavigation}
              className="lg:hidden"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="font-display text-ink truncate text-xl font-semibold tracking-tight sm:text-2xl lg:text-[26px]">
                {title}
              </h1>
              {subtitle ? (
                <p className="text-muted truncate text-[13px] sm:text-sm">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 lg:flex-nowrap">
            {topbarStart ? (
              <div className="w-full sm:w-[300px] sm:flex-none">
                {topbarStart}
              </div>
            ) : null}
            {actions}
            {topbarEnd}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <LoadingBar isActive={isLoading} label="Atualizando dados" />
        </div>
      </header>

      <main
        className={`${COLUMN_CLASSES} stagger flex flex-col gap-4 px-4 pt-2 pb-10 sm:px-6 lg:px-8`}
      >
        {children}
      </main>
    </>
  )
}
