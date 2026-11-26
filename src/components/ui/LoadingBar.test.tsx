import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoadingBar } from './LoadingBar'

describe('LoadingBar', () => {
  it('announces loading while active', () => {
    render(<LoadingBar isActive label="Atualizando dados" />)
    expect(
      screen.getByRole('progressbar', { name: 'Atualizando dados' }),
    ).toBeInTheDocument()
  })

  it('renders nothing when idle', () => {
    render(<LoadingBar isActive={false} />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
