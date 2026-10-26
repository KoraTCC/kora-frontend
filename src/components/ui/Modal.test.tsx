import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders an accessible dialog when open', () => {
    render(
      <Modal
        open
        onClose={vi.fn()}
        title="Confirmar"
        description="Tem certeza?"
      >
        <p>Conteúdo</p>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Confirmar' })
    expect(dialog).toHaveAccessibleDescription('Tem certeza?')
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('renders nothing inside when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Confirmar">
        <p>Conteúdo</p>
      </Modal>,
    )
    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument()
  })

  it('closes from the close button and from Esc', async () => {
    const onClose = vi.fn()
    render(<Modal open onClose={onClose} title="Confirmar" />)

    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    fireEvent(
      screen.getByRole('dialog'),
      new Event('cancel', { cancelable: true }),
    )
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('returns focus to the trigger when it closes', () => {
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()

    const { rerender } = render(
      <Modal open onClose={vi.fn()} title="Confirmar" />,
    )
    rerender(<Modal open={false} onClose={vi.fn()} title="Confirmar" />)

    expect(trigger).toHaveFocus()
    trigger.remove()
  })

  it('gives initial focus to the element marked with data-autofocus', () => {
    render(
      <Modal open onClose={vi.fn()} title="Código">
        <input aria-label="Primeiro dígito" data-autofocus="" />
      </Modal>,
    )
    expect(screen.getByLabelText('Primeiro dígito')).toHaveFocus()
  })
})
