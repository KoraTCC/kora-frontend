import { describe, expect, it } from 'vitest'
import { maskSecret } from './maskSecret'

describe('maskSecret', () => {
  it('keeps the prefix and the last characters', () => {
    expect(maskSecret('sk_test_abcdef123456')).toBe('sk_test_••••••••3456')
  })
})
