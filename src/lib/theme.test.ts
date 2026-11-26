import { describe, expect, it } from 'vitest'
import { oppositeThemeMode, resolveThemeMode, revealRadius } from './theme'

describe('resolveThemeMode', () => {
  it('keeps a stored mode', () => {
    expect(resolveThemeMode('dark')).toBe('dark')
    expect(resolveThemeMode('light')).toBe('light')
  })

  it('falls back to light for anything else', () => {
    expect(resolveThemeMode(null)).toBe('light')
    expect(resolveThemeMode('auto')).toBe('light')
    expect(resolveThemeMode(42)).toBe('light')
  })
})

describe('oppositeThemeMode', () => {
  it('flips the mode', () => {
    expect(oppositeThemeMode('light')).toBe('dark')
    expect(oppositeThemeMode('dark')).toBe('light')
  })
})

describe('revealRadius', () => {
  it('reaches the farthest corner from the origin', () => {
    expect(revealRadius(0, 0, 300, 400)).toBe(500)
    expect(revealRadius(300, 400, 300, 400)).toBe(500)
  })

  it('from the centre, reaches any corner', () => {
    expect(revealRadius(150, 200, 300, 400)).toBe(250)
  })
})
