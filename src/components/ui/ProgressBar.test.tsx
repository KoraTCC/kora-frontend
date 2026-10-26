import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('reports a clamped percentage', () => {
    render(<ProgressBar value={1.4} label="Uso" />)
    expect(screen.getByRole('progressbar', { name: 'Uso' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    )
  })
})
