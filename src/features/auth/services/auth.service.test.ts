import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '#/lib/http'
import { logout } from './auth.service'

function stubFetch(status: number) {
  const fetchMock = vi.fn(() =>
    Promise.resolve(new Response(status === 204 ? null : '{}', { status })),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('logout', () => {
  it('posts to /auth/logout with the session cookies and accepts 204', async () => {
    const fetchMock = stubFetch(204)

    await expect(logout()).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/logout$/),
      expect.objectContaining({ method: 'POST', credentials: 'include' }),
    )
  })

  it('does not try to refresh the session on 401', async () => {
    const fetchMock = stubFetch(401)

    await expect(logout()).rejects.toBeInstanceOf(ApiError)
    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
