import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BarChart } from './BarChart'

describe('BarChart', () => {
  it('exposes a text alternative and scales bars to the tallest', () => {
    const { container } = render(
      <BarChart
        label="Cobranças por dia"
        bars={[
          { label: 'seg', segments: [{ value: 50, tone: 'lime' }] },
          { label: 'ter', segments: [{ value: 100, tone: 'lime' }] },
        ]}
      />,
    )
    expect(
      screen.getByRole('img', { name: 'Cobranças por dia' }),
    ).toBeInTheDocument()
    const heights = [
      ...container.querySelectorAll<HTMLElement>('[style*="height"]'),
    ]
      .filter((element) => element.className.includes('rounded-t'))
      .map((element) => element.style.height)
    expect(heights).toEqual(['50%', '100%'])
  })
})
