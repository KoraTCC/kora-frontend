import { useEffect, useState } from 'react'
import {
  DEFAULT_THEME_MODE,
  THEME_STORAGE_KEY,
  oppositeThemeMode,
  resolveThemeMode,
} from '#/lib/theme'
import type { ThemeMode } from '#/lib/theme'

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  root.dataset.theme = mode
  root.style.colorScheme = mode
}

/**
 * Current theme and a toggle. The inline script in `__root.tsx` already set
 * `data-theme` before paint; this only mirrors it and persists changes.
 */
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_THEME_MODE)

  // Read after mount so the prerendered HTML and the first render match.
  useEffect(() => {
    setMode(resolveThemeMode(document.documentElement.dataset.theme))
  }, [])

  function toggleTheme() {
    const next = oppositeThemeMode(mode)
    applyTheme(next)
    setMode(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage blocked: the theme still changes for this visit.
    }
  }

  return { mode, toggleTheme }
}
