import { describe, expect, it } from 'vitest'
import { easeOutCubic, interpolate } from './easing'

describe('easeOutCubic', () => {
  it('starts at 0 and ends at 1', () => {
    expect(easeOutCubic(0)).toBe(0)
    expect(easeOutCubic(1)).toBe(1)
  })

  it('is ahead of linear halfway through', () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5)
  })

  it('clamps out-of-range progress', () => {
    expect(easeOutCubic(-1)).toBe(0)
    expect(easeOutCubic(2)).toBe(1)
  })
})

describe('interpolate', () => {
  it('moves from one value to the other', () => {
    expect(interpolate(10, 20, 0)).toBe(10)
    expect(interpolate(10, 20, 0.5)).toBe(15)
    expect(interpolate(10, 20, 1)).toBe(20)
  })
})
