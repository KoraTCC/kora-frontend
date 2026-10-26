import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Stepper } from './Stepper'

describe('Stepper', () => {
  it('marks the current step for assistive tech', () => {
    render(
      <Stepper
        label="Etapas"
        steps={['Criada', 'Detectada', 'Confirmada']}
        current={1}
      />,
    )
    const steps = screen.getAllByRole('listitem')
    expect(screen.getByRole('list', { name: 'Etapas' })).toBeInTheDocument()
    expect(steps[1]).toHaveAttribute('aria-current', 'step')
    expect(steps[0]).not.toHaveAttribute('aria-current')
  })
})
