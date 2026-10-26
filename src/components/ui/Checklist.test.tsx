import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Checklist } from './Checklist'

describe('Checklist', () => {
  it('says which items are done in text, not only visually', () => {
    render(
      <Checklist
        items={[
          { id: '1', label: 'Gerar chave', isDone: true },
          { id: '2', label: 'Testar', isDone: false },
        ]}
      />,
    )
    expect(screen.getByText('Gerar chave')).toHaveTextContent(
      'Gerar chave (feito)',
    )
    expect(screen.getByText('Testar')).toHaveTextContent('Testar (pendente)')
  })
})
