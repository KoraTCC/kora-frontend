import { useCallback, useEffect, useState } from 'react'

const TICK_MS = 1000

/** Counts down from `durationSeconds` to zero; `restart` starts over. */
export function useCountdown(durationSeconds: number) {
  const [endsAt, setEndsAt] = useState(
    () => Date.now() + durationSeconds * 1000,
  )
  const [now, setNow] = useState(() => Date.now())

  const secondsLeft = Math.max(0, Math.ceil((endsAt - now) / 1000))
  const isDone = secondsLeft === 0

  useEffect(() => {
    if (isDone) return
    const intervalId = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(intervalId)
  }, [isDone])

  const restart = useCallback(() => {
    const startedAt = Date.now()
    setNow(startedAt)
    setEndsAt(startedAt + durationSeconds * 1000)
  }, [durationSeconds])

  return { secondsLeft, isDone, restart }
}
