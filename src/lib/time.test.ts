import { describe, expect, it } from 'vitest'
import { formatCountdown } from './time'

describe('formatCountdown', () => {
  it('formats seconds as mm:ss', () => {
    expect(formatCountdown(134)).toBe('02:14')
    expect(formatCountdown(28)).toBe('00:28')
    expect(formatCountdown(0)).toBe('00:00')
  })

  it('never goes below zero and drops fractions', () => {
    expect(formatCountdown(-5)).toBe('00:00')
    expect(formatCountdown(59.9)).toBe('00:59')
  })
})
