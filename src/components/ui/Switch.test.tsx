import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Switch } from './Switch'

describe('Switch', () => {
  it('is a labelled switch described by its hint', async () => {
    render(
      <Switch label="Expirar automaticamente" description="Sem intervenção." />,
    )
    const control = screen.getByRole('switch', {
      name: 'Expirar automaticamente',
    })

    expect(control).toHaveAccessibleDescription('Sem intervenção.')
    await userEvent.click(control)
    expect(control).toBeChecked()
  })
})
