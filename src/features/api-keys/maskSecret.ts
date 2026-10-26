/** `sk_test_91be44ad…59d0` → `sk_test_••••••••••••••59d0`. */
export function maskSecret(secret: string, visibleSuffix = 4): string {
  const prefixEnd = secret.lastIndexOf('_') + 1
  const prefix = secret.slice(0, prefixEnd)
  const hiddenLength = Math.max(secret.length - prefixEnd - visibleSuffix, 0)
  return `${prefix}${'•'.repeat(hiddenLength)}${secret.slice(-visibleSuffix)}`
}
