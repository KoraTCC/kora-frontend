const KEY_PREFIX = /^(?:[a-z]+_(?:test|live)_|whsec_)/

/** `sk_test_91be44ad…59d0` → `sk_test_••••••••••••••59d0`. */
export function maskSecret(secret: string, visibleSuffix = 4): string {
  const prefix = KEY_PREFIX.exec(secret)?.[0] ?? ''
  const hiddenLength = Math.max(
    secret.length - prefix.length - visibleSuffix,
    0,
  )
  return `${prefix}${'•'.repeat(hiddenLength)}${secret.slice(-visibleSuffix)}`
}
