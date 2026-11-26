import { describe, expect, it, vi } from 'vitest'
import { buildColorRamp, paintGrain, paintScene } from './coinRibbonPaint'

/** Records every call made on a 2D context without drawing anything. */
function createRecordingContext() {
  const calls: Array<string> = []
  const gradient = { addColorStop: vi.fn() }
  const target: Record<string, unknown> = {
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    createImageData: (width: number, height: number) => ({
      data: new Uint8ClampedArray(width * height * 4),
    }),
  }
  const ctx = new Proxy(target, {
    get(object, key: string) {
      if (key in object) return object[key]
      return () => {
        calls.push(key)
      }
    },
    set(object, key: string, value) {
      object[key] = value
      return true
    },
  })
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls }
}

describe('buildColorRamp', () => {
  it('starts and ends on the outer stops', () => {
    const ramp = buildColorRamp(
      [
        [0, '#000000'],
        [1, '#ffffff'],
      ],
      3,
    )
    expect(ramp).toEqual(['rgb(0,0,0)', 'rgb(128,128,128)', 'rgb(255,255,255)'])
  })

  it('interpolates inside the matching segment', () => {
    const ramp = buildColorRamp(
      [
        [0, '#000000'],
        [0.5, '#ff0000'],
        [1, '#ff0000'],
      ],
      5,
    )
    expect(ramp[1]).toBe('rgb(128,0,0)')
    expect(ramp[3]).toBe('rgb(255,0,0)')
  })
})

describe('paintGrain', () => {
  it('fills every pixel with an opaque grey', () => {
    const { ctx, calls } = createRecordingContext()
    const putImageData = vi.fn()
    Object.assign(ctx, { putImageData })

    paintGrain(ctx, 2, 1, () => 0.5)

    const [image] = putImageData.mock.calls[0]
    expect(Array.from(image.data)).toEqual([
      128, 128, 128, 255, 128, 128, 128, 255,
    ])
    expect(calls).not.toContain('putImageData')
  })
})

describe('paintScene', () => {
  it('draws the ribbon and the coin for a frame', () => {
    const { ctx, calls } = createRecordingContext()

    paintScene(ctx, {
      shape: { width: 800, height: 600, phase: 1, amplitude: 1 },
      coin: { x: 300, velocity: 200, roll: 1 },
      radius: 60,
    })

    expect(calls[0]).toBe('clearRect')
    expect(calls.filter((call) => call === 'fill').length).toBeGreaterThan(280)
    expect(calls).toContain('ellipse')
  })
})
