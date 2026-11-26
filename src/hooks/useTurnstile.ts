import { useEffect, useRef, useState } from 'react'

const SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type TurnstileRenderOptions = {
  sitekey: string
  theme: 'light' | 'dark'
  language: string
  size: 'flexible'
  'response-field': boolean
}

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
  getResponse: (widgetId: string) => string | undefined
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null

/** Loads Cloudflare's script once per page, shared by every widget. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)

  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile)
      else reject(new Error('Turnstile script loaded without its API'))
    }
    script.onerror = () => {
      // Allow a retry on the next mount (e.g. the network came back).
      scriptPromise = null
      script.remove()
      reject(new Error('Could not load the Turnstile script'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

function currentTheme(): 'light' | 'dark' {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/**
 * Cloudflare Turnstile (anti-bot challenge). Renders the widget into
 * `containerRef` and exposes its token. Without `VITE_TURNSTILE_SITE_KEY`
 * it stays off and `getToken` returns an empty string — the API also skips
 * the check when it has no secret key.
 *
 * Tokens are single use: call `reset` after every submit.
 */
export function useTurnstile(
  siteKey: string | undefined = import.meta.env.VITE_TURNSTILE_SITE_KEY,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [hasLoadError, setHasLoadError] = useState(false)

  useEffect(() => {
    if (!siteKey) return
    let isCancelled = false

    loadTurnstile()
      .then((api) => {
        if (isCancelled || !containerRef.current) return
        widgetIdRef.current = api.render(containerRef.current, {
          sitekey: siteKey,
          theme: currentTheme(),
          language: 'pt-br',
          size: 'flexible',
          // The token is read with getToken; no hidden input in the form.
          'response-field': false,
        })
      })
      .catch(() => {
        if (!isCancelled) setHasLoadError(true)
      })

    return () => {
      isCancelled = true
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current)
      widgetIdRef.current = null
    }
  }, [siteKey])

  function getToken(): string {
    if (!widgetIdRef.current) return ''
    return window.turnstile?.getResponse(widgetIdRef.current) ?? ''
  }

  function reset() {
    if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current)
  }

  return {
    containerRef,
    isEnabled: Boolean(siteKey),
    hasLoadError,
    getToken,
    reset,
  }
}
