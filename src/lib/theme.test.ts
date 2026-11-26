import { describe, expect, it } from 'vitest'
import { oppositeThemeMode, resolveThemeMode } from './theme'

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
