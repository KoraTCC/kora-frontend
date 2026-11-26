import { Moon, Sun } from 'lucide-react'
import type { MouseEvent } from 'react'
import { IconButton } from '#/components/ui/IconButton'
import { useTheme } from '#/hooks/useTheme'

const LABELS = {
  light: 'Ativar tema escuro',
  dark: 'Ativar tema claro',
} as const

/**
 * Switches between the light and dark Kora themes; the choice is remembered.
 * The new theme spreads out from the button.
 */
export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme()
  const icon =
    mode === 'light' ? (
      <Moon size={15} aria-hidden />
    ) : (
      <Sun size={15} aria-hidden />
    )

  // Centre of the button, so a keyboard press animates from the same spot.
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  return (
    <IconButton
      label={LABELS[mode]}
      title={LABELS[mode]}
      icon={icon}
      onClick={handleClick}
    />
  )
}
