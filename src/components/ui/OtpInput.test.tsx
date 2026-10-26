import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { OtpInput } from './OtpInput'

function ControlledOtp({ error }: { error?: string }) {
  const [value, setValue] = useState('')
  return (
    <>
      <OtpInput
        label="Código"
        value={value}
        onChange={setValue}
        error={error}
      />
      <output>{value}</output>
    </>
  )
}

function getCells() {
  return screen.getAllByRole('textbox')
}

describe('OtpInput', () => {
  it('renders one labelled cell per digit inside a named group', () => {
    render(<ControlledOtp />)
    expect(screen.getByRole('group', { name: 'Código' })).toBeInTheDocument()
    expect(getCells()).toHaveLength(6)
    expect(screen.getByLabelText('Dígito 1 de 6')).toBeInTheDocument()
  })

  it('advances while typing and ignores non-digits', async () => {
    render(<ControlledOtp />)
    await userEvent.click(getCells()[0])
    await userEvent.keyboard('4a17')

    expect(screen.getByRole('status')).toHaveTextContent('417')
    expect(getCells()[3]).toHaveFocus()
  })

  it('fills every cell on paste', async () => {
    render(<ControlledOtp />)
    await userEvent.click(getCells()[0])
    await userEvent.paste('123456')

    expect(screen.getByRole('status')).toHaveTextContent('123456')
  })

  it('removes the previous digit on Backspace', async () => {
    render(<ControlledOtp />)
    await userEvent.click(getCells()[0])
    await userEvent.keyboard('12{Backspace}')

    expect(screen.getByRole('status')).toHaveTextContent(/^1$/)
  })

  it('links the error to the group', () => {
    render(<ControlledOtp error="Código inválido" />)
    expect(screen.getByRole('group')).toHaveAccessibleDescription(
      'Código inválido',
    )
  })
})
