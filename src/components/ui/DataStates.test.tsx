import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { FormError } from './FormError'
import { LiveTag } from './LiveTag'
import { Skeleton } from './Skeleton'

describe('data states', () => {
  it('Skeleton announces loading', () => {
    render(<Skeleton label="Carregando cobranças…" />)
    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando cobranças…',
    )
  })

  it('ErrorState alerts and retries', async () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: 'Tentar de novo' }),
    )
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('EmptyState explains why there is nothing', () => {
    render(
      <EmptyState title="Nenhuma cobrança" description="Ajuste os filtros." />,
    )
    expect(screen.getByText('Nenhuma cobrança')).toBeInTheDocument()
    expect(screen.getByText('Ajuste os filtros.')).toBeInTheDocument()
  })

  it('FormError renders only with a message', () => {
    const { rerender } = render(<FormError />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    rerender(<FormError message="Falhou" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Falhou')
  })

  it('LiveTag says it is live in text', () => {
    render(<LiveTag />)
    expect(screen.getByText('Ao vivo')).toBeInTheDocument()
  })
})
