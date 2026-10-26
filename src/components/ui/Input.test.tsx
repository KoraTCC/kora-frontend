import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('is labelled by its label', () => {
    render(<Input label="E-mail" />)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('links the error message to the field', () => {
    render(<Input label="E-mail" error="E-mail inválido" />)
    const input = screen.getByLabelText('E-mail')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('E-mail inválido')
  })
})
