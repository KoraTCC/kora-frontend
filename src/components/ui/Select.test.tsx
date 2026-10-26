import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Select } from './Select'

const OPTIONS = [
  { value: 'sepolia', label: 'Sepolia' },
  { value: 'amoy', label: 'Amoy' },
]

describe('Select', () => {
  it('is labelled and selectable', async () => {
    render(
      <Select
        label="Rede"
        options={OPTIONS}
        defaultValue="sepolia"
        hint="Rede padrão"
      />,
    )
    const select = screen.getByRole('combobox', { name: 'Rede' })

    expect(select).toHaveAccessibleDescription('Rede padrão')
    await userEvent.selectOptions(select, 'amoy')
    expect(select).toHaveValue('amoy')
  })

  it('shows the error instead of the hint', () => {
    render(
      <Select
        label="Rede"
        options={OPTIONS}
        hint="Rede padrão"
        error="Obrigatório"
      />,
    )
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
      'Obrigatório',
    )
  })
})
