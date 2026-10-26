/** Tailwind text colour for an HTTP status code. */
export function httpStatusClass(statusCode: number): string {
  if (statusCode >= 500) return 'text-status-failed'
  if (statusCode >= 400) return 'text-status-partial'
  return 'text-lime'
}
