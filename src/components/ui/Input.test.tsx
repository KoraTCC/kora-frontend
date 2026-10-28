import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { INPUT_ALLOW, Input } from './Input'

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

  it('drops characters the field does not allow', () => {
    render(<Input label="Valor" allow={INPUT_ALLOW.money} />)
    const input = screen.getByLabelText<HTMLInputElement>('Valor')
    fireEvent.change(input, { target: { value: '12a,3$4!' } })
    expect(input.value).toBe('12,34')
  })

  it('always has a length limit', () => {
    render(<Input label="Nome" />)
    expect(screen.getByLabelText('Nome')).toHaveAttribute('maxLength', '255')
  })

  it('limits e-mails to 254 characters unless told otherwise', () => {
    render(<Input label="E-mail" type="email" />)
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('maxLength', '254')
  })

  it('applies a mask on every change', () => {
    render(<Input label="Valor" mask={(value) => value.toUpperCase()} />)
    const input = screen.getByLabelText<HTMLInputElement>('Valor')
    fireEvent.change(input, { target: { value: 'abc' } })
    expect(input.value).toBe('ABC')
  })
})
