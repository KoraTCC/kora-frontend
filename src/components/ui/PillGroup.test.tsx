import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PillGroup } from './PillGroup'

const OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'paid', label: 'Pagas' },
] as const

describe('PillGroup', () => {
  it('exposes a radio group with the selected option checked', () => {
    render(
      <PillGroup
        label="Status"
        options={OPTIONS}
        value="all"
        onChange={vi.fn()}
      />,
    )
    expect(
      screen.getByRole('radiogroup', { name: 'Status' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Todas' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Pagas' })).not.toBeChecked()
  })

  it('reports the chosen value', async () => {
    const onChange = vi.fn()
    render(
      <PillGroup
        label="Status"
        options={OPTIONS}
        value="all"
        onChange={onChange}
      />,
    )
    await userEvent.click(screen.getByRole('radio', { name: 'Pagas' }))
    expect(onChange).toHaveBeenCalledWith('paid')
  })
})
