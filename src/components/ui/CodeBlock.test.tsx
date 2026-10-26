import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CodeBlock } from './CodeBlock'

describe('CodeBlock', () => {
  it('renders the code verbatim under its label', () => {
    render(<CodeBlock label="Exemplo" code={'{\n  "amount": 100\n}'} />)
    expect(screen.getByLabelText('Exemplo')).toHaveTextContent(
      '{ "amount": 100}',
    )
  })
})
