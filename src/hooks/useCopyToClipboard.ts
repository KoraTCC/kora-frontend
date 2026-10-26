import { useCallback, useEffect, useState } from 'react'

const FEEDBACK_MS = 1600

export type CopyState = 'idle' | 'copied' | 'failed'

/** Copies text and exposes a short-lived "copied"/"failed" state for feedback. */
export function useCopyToClipboard() {
  const [state, setState] = useState<CopyState>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timeoutId = setTimeout(() => setState('idle'), FEEDBACK_MS)
    return () => clearTimeout(timeoutId)
  }, [state])

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
  }, [])

  return { state, copy }
}
