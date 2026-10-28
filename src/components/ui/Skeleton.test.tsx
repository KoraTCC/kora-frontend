import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SkeletonChart, SkeletonRows, SkeletonStats } from './Skeleton'

describe('Skeleton', () => {
  it('announces what is loading', () => {
    render(<SkeletonStats label="Carregando indicadores…" />)
    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando indicadores…',
    )
  })

  it('renders one placeholder card per stat', () => {
    const { container } = render(<SkeletonStats count={3} />)
    expect(container.querySelectorAll('.rounded-\\[14px\\]')).toHaveLength(3)
  })

  it('renders the requested number of table rows', () => {
    const { container } = render(<SkeletonRows rows={4} />)
    expect(container.querySelectorAll('.border-b')).toHaveLength(4)
  })

  it('hides the placeholder shapes from screen readers', () => {
    render(<SkeletonChart />)
    const shapes = screen
      .getByRole('status')
      .querySelectorAll('span[aria-hidden]')
    expect(shapes.length).toBeGreaterThan(0)
  })
})
