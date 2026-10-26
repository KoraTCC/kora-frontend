import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button, buttonClasses } from './Button'

describe('Button', () => {
  it('defaults to type="button" and handles clicks', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Salvar</Button>)

    const button = screen.getByRole('button', { name: 'Salvar' })
    expect(button).toHaveAttribute('type', 'button')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Salvar
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('only fills the width when isBlock is set', () => {
    expect(buttonClasses({ isBlock: true })).toContain('w-full')
    expect(buttonClasses()).not.toContain('w-full')
  })
})
