import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTurnstile } from './useTurnstile'

function stubTurnstileApi() {
  const api = {
    render: vi.fn(() => 'widget-1'),
    reset: vi.fn(),
    remove: vi.fn(),
    getResponse: vi.fn(() => 'token-123'),
  }
  window.turnstile = api
  return api
}

/** Mounts the hook with its container attached, like the Captcha slot does. */
function renderWithContainer(siteKey: string | undefined) {
  return renderHook(() => {
    const turnstile = useTurnstile(siteKey)
    if (!turnstile.containerRef.current) {
      turnstile.containerRef.current = document.createElement('div')
    }
    return turnstile
  })
}

afterEach(() => {
  delete window.turnstile
})

describe('useTurnstile', () => {
  it('stays off without a site key', () => {
    const api = stubTurnstileApi()
    const { result } = renderWithContainer(undefined)

    expect(result.current.isEnabled).toBe(false)
    expect(result.current.getToken()).toBe('')
    expect(api.render).not.toHaveBeenCalled()
  })

  it('renders the widget and reads its token', async () => {
    const api = stubTurnstileApi()
    const { result } = renderWithContainer('site-key')

    await waitFor(() => expect(api.render).toHaveBeenCalledOnce())
    expect(api.render).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      expect.objectContaining({ sitekey: 'site-key', language: 'pt-br' }),
    )
    expect(result.current.isEnabled).toBe(true)
    expect(result.current.getToken()).toBe('token-123')
  })

  it('resets the widget and removes it on unmount', async () => {
    const api = stubTurnstileApi()
    const { result, unmount } = renderWithContainer('site-key')
    await waitFor(() => expect(api.render).toHaveBeenCalledOnce())

    result.current.reset()
    expect(api.reset).toHaveBeenCalledWith('widget-1')

    unmount()
    expect(api.remove).toHaveBeenCalledWith('widget-1')
  })
})
