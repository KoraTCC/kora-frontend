import { describe, expect, it } from 'vitest'
import { formatAge, formatRelative } from './date'

const NOW = new Date('2025-08-28T14:00:00Z').getTime()
const ago = (ms: number) => new Date(NOW - ms).toISOString()

describe('formatAge', () => {
  it('picks the largest whole unit', () => {
    expect(formatAge(ago(20_000), NOW)).toBe('agora')
    expect(formatAge(ago(14 * 60_000), NOW)).toBe('14 min')
    expect(formatAge(ago(3 * 3_600_000), NOW)).toBe('3 h')
    expect(formatAge(ago(12 * 86_400_000), NOW)).toBe('12 d')
  })

  it('never reports negative ages for future dates', () => {
    expect(formatAge(new Date(NOW + 60_000).toISOString(), NOW)).toBe('agora')
  })
})

describe('formatRelative', () => {
  it('prefixes "há" except for "agora"', () => {
    expect(formatRelative(ago(2 * 60_000), NOW)).toBe('há 2 min')
    expect(formatRelative(ago(1_000), NOW)).toBe('agora')
  })
})
