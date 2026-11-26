type LoadingBarProps = {
  isActive: boolean
  /** Accessible name while active. */
  label?: string
}

/** Thin indeterminate bar for background loading; fills its parent's width. */
export function LoadingBar({
  isActive,
  label = 'Carregando',
}: LoadingBarProps) {
  if (!isActive) return null

  return (
    <div
      role="progressbar"
      aria-label={label}
      className="bg-lime/15 h-0.5 w-full overflow-hidden"
    >
      <div className="bg-lime animate-loading-bar h-full w-2/5 rounded-full motion-reduce:w-full motion-reduce:animate-none" />
    </div>
  )
}
