import { useEffect, useRef, useState } from 'react'
import { easeOutCubic, interpolate } from '#/lib/easing'

const DEFAULT_DURATION_MS = 900

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Animates a number from where it was to `target`: from 0 on mount, from the
 * previous value when `target` changes. Jumps straight to the end when the
 * user asked for reduced motion.
 */
export function useCountUp(
  target: number,
  durationMs: number = DEFAULT_DURATION_MS,
): number {
  const [value, setValue] = useState(0)
  const valueRef = useRef(0)

  useEffect(() => {
    const from = valueRef.current
    if (from === target) return

    if (prefersReducedMotion()) {
      valueRef.current = target
      setValue(target)
      return
    }

    const start = performance.now()
    let frameId = 0

    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1)
      const next = interpolate(from, target, easeOutCubic(progress))
      valueRef.current = next
      setValue(next)
      if (progress < 1) frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [target, durationMs])

  return value
}
