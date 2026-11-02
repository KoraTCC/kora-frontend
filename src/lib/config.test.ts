import { describe, expect, it } from 'vitest'
import { resolveApiUrl } from './config'

describe('resolveApiUrl', () => {
  it('prefers the runtime config', () => {
    expect(
      resolveApiUrl({ apiUrl: 'https://api.kora.dev/' }, 'http://build:3333'),
    ).toBe('https://api.kora.dev')
  })

  it('falls back to the build-time URL, then to localhost', () => {
    expect(resolveApiUrl({}, 'http://build:3333/')).toBe('http://build:3333')
    expect(resolveApiUrl(undefined)).toBe('http://localhost:3333')
  })

  it('ignores an invalid runtime value', () => {
    expect(resolveApiUrl({ apiUrl: 'not a url' }, 'http://build:3333')).toBe(
      'http://build:3333',
    )
  })
})
