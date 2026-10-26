const LOCALE = 'pt-BR'
const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

const dayMonthFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
})
const hourMinuteFormatter = new Intl.DateTimeFormat(LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
})
const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})
const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

/** Elapsed time, short: `agora`, `14 min`, `3 h`, `12 d`. */
export function formatAge(iso: string, now: number = Date.now()): string {
  const elapsed = Math.max(0, now - new Date(iso).getTime())
  if (elapsed < MINUTE_MS) return 'agora'
  if (elapsed < HOUR_MS) return `${Math.floor(elapsed / MINUTE_MS)} min`
  if (elapsed < DAY_MS) return `${Math.floor(elapsed / HOUR_MS)} h`
  return `${Math.floor(elapsed / DAY_MS)} d`
}

/** `há 14 min`, or `agora`. */
export function formatRelative(iso: string, now: number = Date.now()): string {
  const age = formatAge(iso, now)
  return age === 'agora' ? age : `há ${age}`
}

/** `28/08 · 14:02`. */
export function formatDayTime(iso: string): string {
  const date = new Date(iso)
  return `${dayMonthFormatter.format(date)} · ${hourMinuteFormatter.format(date)}`
}

/** `14:09:02`. */
export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso))
}

/** `12/08/2025`. */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}
