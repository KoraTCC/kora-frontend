import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('shows the status as text, not only as color', () => {
    render(<StatusBadge tone="pending">Pendente</StatusBadge>)
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })
})
