import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination, getVisiblePages } from './Pagination'

describe('getVisiblePages', () => {
  it('keeps a window around the current page inside the bounds', () => {
    expect(getVisiblePages(1, 8)).toEqual([1, 2, 3])
    expect(getVisiblePages(5, 8)).toEqual([4, 5, 6])
    expect(getVisiblePages(8, 8)).toEqual([6, 7, 8])
    expect(getVisiblePages(1, 2)).toEqual([1, 2])
  })
})

describe('Pagination', () => {
  it('marks the current page and disables going back from the first', async () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        page={1}
        pageCount={3}
        onPageChange={onPageChange}
        summary="Mostrando 20 de 60"
      />,
    )

    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('button', { name: '← Anterior' })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: 'Próxima →' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
