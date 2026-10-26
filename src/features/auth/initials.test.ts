import { describe, expect, it } from 'vitest'
import { getInitials } from './initials'

describe('getInitials', () => {
  it('uses first and last names', () => {
    expect(getInitials('Gustavo Melo')).toBe('GM')
    expect(getInitials('  ana maria lima ')).toBe('AL')
    expect(getInitials('ana')).toBe('A')
  })
})
