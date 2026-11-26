export const THEME_MODES = ['light', 'dark'] as const

export type ThemeMode = (typeof THEME_MODES)[number]

/** `localStorage` key — also read by the inline init script in `__root.tsx`. */
export const THEME_STORAGE_KEY = 'theme'

/** The app opens light, like the login screen, until the user picks dark. */
export const DEFAULT_THEME_MODE: ThemeMode = 'light'

/** Anything that is not a known mode (missing, old `auto`, garbage) → default. */
export function resolveThemeMode(stored: unknown): ThemeMode {
  if (stored === 'light' || stored === 'dark') return stored
  return DEFAULT_THEME_MODE
}

export function oppositeThemeMode(mode: ThemeMode): ThemeMode {
  return mode === 'light' ? 'dark' : 'light'
}

/**
 * Radius that lets a circle centred on (x, y) cover the whole viewport —
 * the distance to the farthest corner. Used by the theme reveal animation.
 */
export function revealRadius(
  x: number,
  y: number,
  width: number,
  height: number,
): number {
  return Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
}
