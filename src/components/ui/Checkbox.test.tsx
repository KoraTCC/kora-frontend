import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('toggles through its label', async () => {
    render(<Checkbox label="Manter sessão" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Manter sessão' })

    await userEvent.click(screen.getByText('Manter sessão'))
    expect(checkbox).toBeChecked()
  })

  it('links the error message to the checkbox', () => {
    render(<Checkbox label="Aceito" error="Aceite os termos" />)
    expect(
      screen.getByRole('checkbox', { name: 'Aceito' }),
    ).toHaveAccessibleDescription('Aceite os termos')
  })
})
