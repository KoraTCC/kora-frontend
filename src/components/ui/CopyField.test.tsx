import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CopyField } from './CopyField'

describe('CopyField', () => {
  it('shows the display value and copies the real one', async () => {
    const user = userEvent.setup()
    render(
      <CopyField
        value="sk_test_secret"
        displayValue="sk_test_••••"
        label="Chave secreta"
      />,
    )

    expect(screen.getByText('sk_test_••••')).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: 'Copiar: Chave secreta' }),
    )

    await expect(navigator.clipboard.readText()).resolves.toBe('sk_test_secret')
    expect(
      screen.getByRole('button', { name: 'Copiado: Chave secreta' }),
    ).toBeInTheDocument()
  })
})
