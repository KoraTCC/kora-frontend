import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AnimatedNumber } from './AnimatedNumber'

function mockReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

describe('AnimatedNumber', () => {
  beforeEach(() => mockReducedMotion(true))
  afterEach(() => vi.unstubAllGlobals())

  it('gives screen readers the final value', () => {
    render(<AnimatedNumber value={1234} />)
    expect(
      screen.getByText('1.234', { selector: '.sr-only' }),
    ).toBeInTheDocument()
  })

  it('shows the final value at once with reduced motion', () => {
    render(<AnimatedNumber value={42} format={(n) => `R$ ${Math.round(n)}`} />)
    expect(
      screen.getByText('R$ 42', { selector: '[aria-hidden]' }),
    ).toBeInTheDocument()
  })
})
