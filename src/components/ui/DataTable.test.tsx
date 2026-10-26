import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTable } from './DataTable'

type Row = { id: string; name: string }

describe('DataTable', () => {
  it('renders headers and one row per item', () => {
    render(
      <DataTable<Row>
        caption="Pessoas"
        columns={[{ key: 'name', header: 'Nome', cell: (row) => row.name }]}
        rows={[
          { id: '1', name: 'Ana' },
          { id: '2', name: 'Bia' },
        ]}
        getRowKey={(row) => row.id}
      />,
    )
    const table = screen.getByRole('table', { name: 'Pessoas' })
    expect(
      within(table).getByRole('columnheader', { name: 'Nome' }),
    ).toBeInTheDocument()
    expect(within(table).getAllByRole('row')).toHaveLength(3)
  })
})
