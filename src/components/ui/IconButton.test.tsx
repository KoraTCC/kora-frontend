import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('exposes the label as the accessible name', () => {
    render(<IconButton label="Fechar" icon={<svg />} />)
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
  })
})
