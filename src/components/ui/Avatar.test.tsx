import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('is an image named after the person when labelled', () => {
    render(<Avatar initials="GM" label="Gustavo Melo" />)
    expect(screen.getByRole('img', { name: 'Gustavo Melo' })).toHaveTextContent(
      'GM',
    )
  })

  it('is hidden from assistive tech without a label', () => {
    render(<Avatar initials="AL" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
