import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DistributionBar } from './DistributionBar'

describe('DistributionBar', () => {
  it('writes every share in the legend', () => {
    render(
      <DistributionBar
        items={[
          { id: 'ok', label: 'Confirmadas', share: 0.62, tone: 'confirmed' },
          { id: 'ko', label: 'Falharam', share: 0.03, tone: 'failed' },
        ]}
        formatShare={(share) => `${Math.round(share * 100)}%`}
      />,
    )
    expect(screen.getByText('Confirmadas').closest('li')).toHaveTextContent(
      '62%',
    )
    expect(screen.getByText('Falharam').closest('li')).toHaveTextContent('3%')
  })
})
