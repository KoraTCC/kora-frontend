/** Fast start, gentle landing — for numbers settling on their value. */
export function easeOutCubic(progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1)
  return 1 - (1 - clamped) ** 3
}

/** Value between `from` and `to` at `progress` (0 → `from`, 1 → `to`). */
export function interpolate(
  from: number,
  to: number,
  progress: number,
): number {
  return from + (to - from) * progress
}
