const LOCALE = 'pt-BR'

const brlFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'BRL',
})

const brlCompactFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const integerFormatter = new Intl.NumberFormat(LOCALE)

/** `24900` (cents) → `R$ 249,00`. */
export function formatBRL(cents: number): string {
  return brlFormatter.format(cents / 100)
}

/** Largest amount the money mask accepts: R$ 99.999.999,99. */
const MONEY_MASK_MAX_DIGITS = 10

/**
 * Money mask for inputs, filled from the right like a banking app:
 * `'2'` → `'0,02'`, `'24900'` → `'249,00'`, `'1234567'` → `'12.345,67'`.
 * Anything that is not a digit is ignored; empty stays empty.
 */
export function maskMoney(value: string): string {
  const digits = value
    .replace(/\D/g, '')
    .replace(/^0+/, '')
    .slice(0, MONEY_MASK_MAX_DIGITS)
  if (!digits) return ''
  const cents = digits.padStart(3, '0')
  const integer = cents.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${integer},${cents.slice(-2)}`
}

/** `48600000` (cents) → `R$ 486 mil`. */
export function formatBRLCompact(cents: number): string {
  return brlCompactFormatter.format(cents / 100)
}

/** `1284` → `1.284`. */
export function formatNumber(value: number): string {
  return integerFormatter.format(value)
}

/** `0.987` → `98,7%`. */
export function formatPercent(ratio: number, fractionDigits = 1): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(ratio)
}

/** `0.082` → `+8,2%`; `-0.01` → `-1,0%`. */
export function formatSignedPercent(ratio: number, fractionDigits = 1): string {
  const sign = ratio > 0 ? '+' : ''
  return `${sign}${formatPercent(ratio, fractionDigits)}`
}

/**
 * Crypto amounts travel as decimal strings (no float rounding). Display uses
 * the Brazilian decimal comma: `'0.0184', 'ETH'` → `0,0184 ETH`.
 */
export function formatCrypto(amount: string, asset: string): string {
  return `${amount.replace('.', ',')} ${asset}`
}
