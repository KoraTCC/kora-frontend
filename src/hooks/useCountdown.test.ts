import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountdown } from './useCountdown'

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts down to zero and restarts', () => {
    const { result } = renderHook(() => useCountdown(3))
    expect(result.current.secondsLeft).toBe(3)

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.secondsLeft).toBe(0)
    expect(result.current.isDone).toBe(true)

    act(() => {
      result.current.restart()
    })
    expect(result.current.secondsLeft).toBe(3)
    expect(result.current.isDone).toBe(false)
  })
})
