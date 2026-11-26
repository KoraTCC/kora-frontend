import { describe, expect, it } from 'vitest'
import {
  chromeShade,
  coinPlacement,
  coinRadius,
  enteringCoin,
  ribbonAt,
  ribbonEdgeAt,
  sampleRibbon,
  stepCoin,
} from './coinRibbon'
import type { RibbonShape } from './coinRibbon'

const shape: RibbonShape = { width: 1000, height: 800, phase: 0, amplitude: 1 }
const fixedRandom = () => 0.5

describe('ribbonAt', () => {
  it('keeps the ribbon around the upper half of the scene', () => {
    for (let x = 0; x <= shape.width; x += 50) {
      const { y } = ribbonAt(x, shape)
      expect(y).toBeGreaterThan(shape.height * 0.2)
      expect(y).toBeLessThan(shape.height * 0.65)
    }
  })

  it('is a flat line when the amplitude is zero', () => {
    const flat = { ...shape, amplitude: 0 }
    expect(ribbonAt(0, flat).y).toBe(ribbonAt(500, flat).y)
  })

  it('changes shape as the phase advances', () => {
    const later = { ...shape, phase: 0.5 }
    expect(ribbonAt(300, later).y).not.toBeCloseTo(ribbonAt(300, shape).y, 0)
  })
})

describe('ribbonEdgeAt', () => {
  it('places the back edge above the front edge', () => {
    const edge = ribbonEdgeAt(400, shape)
    expect(edge.frontX).toBe(400)
    expect(edge.backY).toBeLessThan(edge.frontY)
  })
})

describe('sampleRibbon', () => {
  it('returns segments + 1 edges that overshoot both sides', () => {
    const edges = sampleRibbon(shape, 10)
    expect(edges).toHaveLength(11)
    expect(edges[0].frontX).toBeLessThan(0)
    expect(edges[10].frontX).toBeGreaterThan(shape.width)
  })
})

describe('chromeShade', () => {
  it('always stays inside the ramp', () => {
    for (let twist = -3; twist <= 3; twist += 0.5) {
      for (let slope = -2; slope <= 2; slope += 0.5) {
        const shade = chromeShade(slope, twist, 200, 1)
        expect(shade).toBeGreaterThanOrEqual(0)
        expect(shade).toBeLessThan(1)
      }
    }
  })
})

describe('coinRadius', () => {
  it('scales with the smaller side of the scene', () => {
    expect(coinRadius(1000, 800)).toBe(80)
    expect(coinRadius(1000, 800, 1.5)).toBe(120)
  })
})

describe('stepCoin', () => {
  it('re-enters from the left after leaving the right side', () => {
    const gone = { x: shape.width + 500, velocity: 300, roll: 4 }
    expect(stepCoin(gone, shape, 80, 0.016, fixedRandom)).toEqual(
      enteringCoin(80, fixedRandom),
    )
  })

  it('rolls forward and turns by distance over radius', () => {
    const coin = { x: 200, velocity: 200, roll: 0 }
    const next = stepCoin(coin, shape, 80, 0.016, fixedRandom)
    const distance = next.x - coin.x
    expect(distance).toBeGreaterThan(0)
    expect(next.roll).toBeCloseTo(distance / 80)
  })

  it('is pushed to the right on a flat ribbon', () => {
    const flat = { ...shape, amplitude: 0 }
    const resting = { x: 300, velocity: 0, roll: 0 }
    expect(
      stepCoin(resting, flat, 80, 0.1, fixedRandom).velocity,
    ).toBeGreaterThan(0)
  })
})

describe('coinPlacement', () => {
  it('puts the coin centre one radius above its contact point', () => {
    const { contact, center } = coinPlacement(400, shape, 80)
    expect(Math.hypot(center.x - contact.x, center.y - contact.y)).toBeCloseTo(
      80,
    )
    expect(center.y).toBeLessThan(contact.y)
  })
})
