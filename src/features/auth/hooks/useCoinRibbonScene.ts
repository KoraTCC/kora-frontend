import { useRef } from 'react'
import { useCanvasAnimation } from '#/hooks/useCanvasAnimation'
import type { CanvasFrame, CanvasSize } from '#/hooks/useCanvasAnimation'
import { coinRadius, enteringCoin, stepCoin } from '#/lib/coinRibbon'
import type { CoinState } from '#/lib/coinRibbon'
import { paintGrain, paintScene } from '#/lib/coinRibbonPaint'
import type { SceneTone } from '#/lib/coinRibbonPaint'

/** How fast the wave travels, in radians of phase per second. */
const WAVE_SPEED = 0.35
/** With reduced motion the scene keeps moving, just very slowly. */
const REDUCED_MOTION_SCALE = 0.25

/** Drives the login pitch animation: a Kora coin rolling on a chrome ribbon. */
export function useCoinRibbonScene(tone: SceneTone) {
  const grainRef = useRef<HTMLCanvasElement>(null)
  const phaseRef = useRef(0)
  const coinRef = useRef<CoinState | null>(null)

  function handleResize({ width, height }: CanvasSize) {
    const grain = grainRef.current
    const ctx = grain?.getContext('2d')
    if (!grain || !ctx || width === 0 || height === 0) return
    grain.width = Math.ceil(width)
    grain.height = Math.ceil(height)
    paintGrain(ctx, grain.width, grain.height)
  }

  function handleFrame({
    ctx,
    width,
    height,
    dt,
    prefersReducedMotion,
  }: CanvasFrame) {
    const step = prefersReducedMotion ? dt * REDUCED_MOTION_SCALE : dt
    phaseRef.current += step * WAVE_SPEED

    const shape = { width, height, phase: phaseRef.current, amplitude: 1 }
    const radius = coinRadius(width, height)
    const coin = stepCoin(
      coinRef.current ?? enteringCoin(radius),
      shape,
      radius,
      step,
    )
    coinRef.current = coin

    paintScene(ctx, { shape, coin, radius, tone })
  }

  const { containerRef, canvasRef } = useCanvasAnimation({
    onFrame: handleFrame,
    onResize: handleResize,
  })

  return { containerRef, canvasRef, grainRef }
}
