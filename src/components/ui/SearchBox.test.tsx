import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchBox } from './SearchBox'

describe('SearchBox', () => {
  it('submits the trimmed query on Enter', async () => {
    const onSearch = vi.fn()
    render(<SearchBox label="Buscar lojistas" onSearch={onSearch} />)

    await userEvent.type(
      screen.getByRole('searchbox', { name: 'Buscar lojistas' }),
      '  vila {Enter}',
    )
    expect(onSearch).toHaveBeenCalledWith('vila')
  })
})
