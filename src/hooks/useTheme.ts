import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import {
  DEFAULT_THEME_MODE,
  THEME_STORAGE_KEY,
  oppositeThemeMode,
  resolveThemeMode,
  revealRadius,
} from '#/lib/theme'
import type { ThemeMode } from '#/lib/theme'

/** Where the reveal starts — usually the centre of the toggle button. */
export type ThemeOrigin = { x: number; y: number }

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  root.dataset.theme = mode
  root.style.colorScheme = mode
}

function canAnimateThemeChange() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  return 'startViewTransition' in document && !prefersReducedMotion
}

/**
 * Current theme and a toggle. The inline script in `__root.tsx` already set
 * `data-theme` before paint; this only mirrors it and persists changes.
 *
 * With an `origin`, the new theme is revealed as a circle growing from that
 * point (View Transitions API; see `::view-transition-new(root)` in
 * styles.css). Without browser support or with reduced motion it swaps at once.
 */
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_THEME_MODE)

  // Read after mount so the prerendered HTML and the first render match.
  useEffect(() => {
    setMode(resolveThemeMode(document.documentElement.dataset.theme))
  }, [])

  function commit(next: ThemeMode) {
    applyTheme(next)
    // Sync render so the toggle icon is already updated in the new snapshot.
    flushSync(() => setMode(next))
  }

  function toggleTheme(origin?: ThemeOrigin) {
    const next = oppositeThemeMode(mode)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage blocked: the theme still changes for this visit.
    }

    if (!origin || !canAnimateThemeChange()) {
      commit(next)
      return
    }

    const root = document.documentElement
    const radius = revealRadius(
      origin.x,
      origin.y,
      window.innerWidth,
      window.innerHeight,
    )
    root.style.setProperty('--theme-reveal-x', `${origin.x}px`)
    root.style.setProperty('--theme-reveal-y', `${origin.y}px`)
    root.style.setProperty('--theme-reveal-r', `${radius}px`)
    document.startViewTransition(() => commit(next))
  }

  return { mode, toggleTheme }
}
