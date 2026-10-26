import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Timeline } from './Timeline'

describe('Timeline', () => {
  it('lists the events in order with their meta', () => {
    render(
      <Timeline
        items={[
          { id: 'a', title: 'Criada', meta: '14:02', state: 'done' },
          { id: 'b', title: 'Confirmada', state: 'pending' },
        ]}
      />,
    )
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Criada14:02')
    expect(items[1]).toHaveTextContent('Confirmada')
  })
})
