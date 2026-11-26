import { useEffect, useRef } from 'react'

export type CanvasFrame = {
  ctx: CanvasRenderingContext2D
  /** CSS pixels; the context is already scaled for the device pixel ratio. */
  width: number
  height: number
  /** Seconds since the previous frame, capped so a background tab doesn't jump. */
  dt: number
  prefersReducedMotion: boolean
}

export type CanvasSize = { width: number; height: number }

type CanvasAnimationOptions = {
  onFrame: (frame: CanvasFrame) => void
  onResize?: (size: CanvasSize) => void
}

const MAX_DT = 1 / 30
const MAX_PIXEL_RATIO = 2

/**
 * Runs `onFrame` on every animation frame for a canvas that fills its
 * container. Handles device pixel ratio, container resizes and cleanup.
 */
export function useCanvasAnimation({
  onFrame,
  onResize,
}: CanvasAnimationOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onFrameRef = useRef(onFrame)
  const onResizeRef = useRef(onResize)

  useEffect(() => {
    onFrameRef.current = onFrame
    onResizeRef.current = onResize
  })

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!container || !canvas || !ctx) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let size: CanvasSize = { width: 0, height: 0 }
    let pixelRatio = 1
    let frameId = 0
    let lastTime = performance.now()

    function resize() {
      if (!container || !canvas) return
      pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
      size = { width: container.clientWidth, height: container.clientHeight }
      canvas.width = Math.round(size.width * pixelRatio)
      canvas.height = Math.round(size.height * pixelRatio)
      onResizeRef.current?.(size)
    }

    function tick(now: number) {
      const dt = Math.min(MAX_DT, (now - lastTime) / 1000)
      lastTime = now
      if (ctx && size.width > 0 && size.height > 0) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        onFrameRef.current({
          ctx,
          width: size.width,
          height: size.height,
          dt,
          prefersReducedMotion: motionQuery.matches,
        })
      }
      frameId = requestAnimationFrame(tick)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [])

  return { containerRef, canvasRef }
}
