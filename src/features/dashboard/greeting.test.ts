import { describe, expect, it } from 'vitest'
import { getGreeting } from './greeting'

describe('getGreeting', () => {
  it('greets by the time of day with the first name', () => {
    expect(getGreeting('Gustavo Melo', new Date(2025, 7, 28, 9))).toBe(
      'Bom dia, Gustavo.',
    )
    expect(getGreeting('Gustavo Melo', new Date(2025, 7, 28, 15))).toBe(
      'Boa tarde, Gustavo.',
    )
    expect(getGreeting('Gustavo Melo', new Date(2025, 7, 28, 21))).toBe(
      'Boa noite, Gustavo.',
    )
  })
})
