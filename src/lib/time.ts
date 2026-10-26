/** Formats a number of seconds as `mm:ss` — e.g. `134` → `02:14`. */
export function formatCountdown(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${pad(minutes)}:${pad(seconds)}`
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}
