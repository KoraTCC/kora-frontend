import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders a separator without content', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders its label', () => {
    render(<Divider>ou</Divider>)
    expect(screen.getByText('ou')).toBeInTheDocument()
  })
})
