import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Callout } from './Callout'

describe('Callout', () => {
  it('renders its message', () => {
    render(<Callout tone="warning">Atenção ao trocar a senha.</Callout>)
    expect(screen.getByText('Atenção ao trocar a senha.')).toBeInTheDocument()
  })
})
