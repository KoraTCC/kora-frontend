import { describe, expect, it } from 'vitest'
import { maskSecret } from './maskSecret'

describe('maskSecret', () => {
  it('keeps the key type prefix and the last characters', () => {
    expect(maskSecret('sk_test_abcdef123456')).toBe('sk_test_••••••••3456')
  })

  it('masks everything after the type prefix, underscores included', () => {
    expect(maskSecret('sk_test_demo_91be_59d0')).toBe('sk_test_••••••••••59d0')
  })

  it('works for webhook secrets', () => {
    expect(maskSecret('whsec_3c8d1e5a7f9b')).toBe('whsec_••••••••7f9b')
  })
})
