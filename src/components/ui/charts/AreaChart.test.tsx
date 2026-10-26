import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AreaChart, buildPaths } from './AreaChart'

describe('buildPaths', () => {
  it('needs at least two points', () => {
    expect(buildPaths([{ label: 'a', value: 1 }])).toEqual({
      linePath: '',
      areaPath: '',
    })
  })

  it('spans the full width and closes the area', () => {
    const { linePath, areaPath } = buildPaths([
      { label: 'a', value: 0 },
      { label: 'b', value: 10 },
    ])
    expect(linePath).toBe('M0.0,168.0 L600.0,12.0')
    expect(areaPath.endsWith('Z')).toBe(true)
  })
})

describe('AreaChart', () => {
  it('exposes a text alternative', () => {
    render(
      <AreaChart
        label="Volume subiu 8%"
        points={[
          { label: 'seg', value: 1 },
          { label: 'ter', value: 2 },
        ]}
      />,
    )
    expect(
      screen.getByRole('img', { name: 'Volume subiu 8%' }),
    ).toBeInTheDocument()
  })
})
