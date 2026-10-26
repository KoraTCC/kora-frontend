import { describe, expect, it } from 'vitest'
import { getFormError, toFieldErrors, zodIssuesToApiIssues } from './formErrors'
import { ApiError } from './http'

const FIELDS = ['email', 'password'] as const

describe('toFieldErrors', () => {
  it('keeps the first message of each known field', () => {
    const errors = toFieldErrors(
      [
        { path: 'email', message: 'first' },
        { path: 'email', message: 'second' },
        { path: 'other', message: 'ignored' },
      ],
      FIELDS,
    )
    expect(errors).toEqual({ email: 'first' })
  })
})

describe('zodIssuesToApiIssues', () => {
  it('joins nested paths with dots', () => {
    expect(
      zodIssuesToApiIssues([{ path: ['a', 0, 'b'], message: 'm' }]),
    ).toEqual([{ path: 'a.0.b', message: 'm' }])
  })
})

describe('getFormError', () => {
  it('returns nothing without an error', () => {
    expect(getFormError(null, FIELDS)).toBeUndefined()
  })

  it('uses a generic message for non-API errors', () => {
    expect(getFormError(new Error('boom'), FIELDS)).toBe(
      'Algo deu errado. Tente novamente.',
    )
  })

  it('leaves field errors to the fields', () => {
    const error = new ApiError(400, 'Invalid', [
      { path: 'email', message: 'bad' },
    ])
    expect(getFormError(error, FIELDS)).toBeUndefined()
  })

  it('shows the API message when no field is involved', () => {
    expect(getFormError(new ApiError(401, 'Credenciais'), FIELDS)).toBe(
      'Credenciais',
    )
  })
})
