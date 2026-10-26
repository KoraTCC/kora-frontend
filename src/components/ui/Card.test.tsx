import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('renders a titled section with its action', () => {
    render(
      <Card title="Resumo" action={<button type="button">Ver todas</button>}>
        <p>Corpo</p>
      </Card>,
    )
    expect(screen.getByRole('heading', { name: 'Resumo' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Ver todas' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Corpo')).toBeInTheDocument()
  })

  it('renders without a header', () => {
    render(
      <Card>
        <p>Só corpo</p>
      </Card>,
    )
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
