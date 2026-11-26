import { Moon, Sun } from 'lucide-react'
import { IconButton } from '#/components/ui/IconButton'
import { useTheme } from '#/hooks/useTheme'

const LABELS = {
  light: 'Ativar tema escuro',
  dark: 'Ativar tema claro',
} as const

/** Switches between the light and dark Kora themes; the choice is remembered. */
export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme()
  const icon =
    mode === 'light' ? (
      <Moon size={15} aria-hidden />
    ) : (
      <Sun size={15} aria-hidden />
    )

  return (
    <IconButton
      label={LABELS[mode]}
      title={LABELS[mode]}
      icon={icon}
      onClick={toggleTheme}
    />
  )
}
