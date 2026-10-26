import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DescriptionList } from './DescriptionList'

describe('DescriptionList', () => {
  it('pairs each term with its value', () => {
    render(<DescriptionList items={[{ label: 'Rede', value: 'Sepolia' }]} />)
    expect(screen.getByRole('term')).toHaveTextContent('Rede')
    expect(screen.getByRole('definition')).toHaveTextContent('Sepolia')
  })
})
