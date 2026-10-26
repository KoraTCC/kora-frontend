import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('shows label, value, unit and hint', () => {
    render(
      <StatCard label="Latência" value={142} unit="ms" hint="p95 · 410 ms" />,
    )
    expect(screen.getByText('Latência')).toBeInTheDocument()
    expect(screen.getByText('142')).toBeInTheDocument()
    expect(screen.getByText('ms')).toBeInTheDocument()
    expect(screen.getByText('p95 · 410 ms')).toBeInTheDocument()
  })
})
