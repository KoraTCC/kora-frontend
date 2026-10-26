import { EXPIRATIONS, TOLERANCES } from './schemas'

type Tolerance = (typeof TOLERANCES)[number]
type Expiration = (typeof EXPIRATIONS)[number]

export const TOLERANCE_LABELS: Record<Tolerance, string> = {
  '0.005': '± 0,5%',
  '0.01': '± 1,0%',
  '0.02': '± 2,0%',
  '0': 'Exato',
}

export const EXPIRATION_LABELS: Record<Expiration, string> = {
  '15': '15 min',
  '30': '30 min',
  '60': '1 h',
  '1440': '24 h',
}

export const TOLERANCE_OPTIONS = TOLERANCES.map((value) => ({
  value,
  label: TOLERANCE_LABELS[value],
}))

export const EXPIRATION_OPTIONS = EXPIRATIONS.map((value) => ({
  value,
  label: EXPIRATION_LABELS[value],
}))
