import { useCallback } from 'react'

/** Returns a function that saves text as a file through the browser. */
export function useFileDownload() {
  return useCallback((filename: string, content: string, type: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
  }, [])
}
