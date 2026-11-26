import { cn } from '#/lib/cn'
import type { SceneTone } from '#/lib/coinRibbonPaint'
import { useCoinRibbonScene } from '../hooks/useCoinRibbonScene'

type CoinRibbonSceneProps = {
  /** Match the ground the scene sits on. */
  tone?: SceneTone
  className?: string
}

/**
 * Decorative animation for the auth pitch panel. Fills the nearest
 * positioned ancestor — the parent decides the size.
 */
export function CoinRibbonScene({
  tone = 'dark',
  className,
}: CoinRibbonSceneProps) {
  const { containerRef, canvasRef, grainRef } = useCoinRibbonScene(tone)

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn('absolute inset-0 overflow-hidden', className)}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      <canvas
        ref={grainRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-10 mix-blend-overlay"
      />
    </div>
  )
}
