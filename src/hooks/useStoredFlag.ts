import { useCallback, useEffect, useState } from 'react'

/**
 * A boolean kept in localStorage under `key`, e.g. "the user hid this
 * banner". Starts `false` and reads the stored value after mount, so server
 * and first client render match.
 */
export function useStoredFlag(key: string) {
  const [isSet, setIsSet] = useState(false)

  useEffect(() => {
    try {
      setIsSet(localStorage.getItem(key) === '1')
    } catch {
      // Storage blocked (private mode, policies): the flag just isn't remembered.
      setIsSet(false)
    }
  }, [key])

  const set = useCallback(() => {
    setIsSet(true)
    try {
      localStorage.setItem(key, '1')
    } catch {
      // Same as above — the flag still holds for this visit.
    }
  }, [key])

  return [isSet, set] as const
}
