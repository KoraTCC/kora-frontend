import type { ZodType } from 'zod'

const API_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3333'
).replace(/\/$/, '')

export type ApiIssue = {
  path: string
  message: string
}

export class ApiError extends Error {
  readonly status: number
  readonly issues: Array<ApiIssue>

  constructor(status: number, message: string, issues: Array<ApiIssue> = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.issues = issues
  }
}

type RequestOptions<T> = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  schema: ZodType<T>
}

const FALLBACK_MESSAGES: Record<number, string> = {
  403: 'Requisição bloqueada pela API.',
  429: 'Muitas tentativas. Aguarde um minuto e tente de novo.',
}
const DEFAULT_ERROR_MESSAGE = 'Algo deu errado. Tente novamente.'

/**
 * Tokens vivem em cookies httpOnly da API, então toda chamada vai com
 * `credentials: 'include'` e nada de autenticação passa pelo JavaScript.
 */
export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, schema }: RequestOptions<T>,
): Promise<T> {
  const response = await sendRequest(path, method, body)
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) throw toApiError(response.status, payload)

  const parsed = schema.safeParse(payload)
  if (!parsed.success) {
    throw new ApiError(response.status, 'Resposta inesperada da API.')
  }
  return parsed.data
}

async function sendRequest(path: string, method: string, body: unknown) {
  try {
    return await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers:
        body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar à API.')
  }
}

function toApiError(status: number, payload: unknown): ApiError {
  const fallback = FALLBACK_MESSAGES[status] ?? DEFAULT_ERROR_MESSAGE
  if (!isRecord(payload)) return new ApiError(status, fallback)

  const message = readMessage(payload.message, status) ?? fallback
  return new ApiError(status, message, readIssues(payload.issues))
}

function readMessage(value: unknown, status: number): string | null {
  // Mensagens de 403/429 do Nest vêm em inglês; usamos a copy local.
  if (status in FALLBACK_MESSAGES) return null
  return typeof value === 'string' ? value : null
}

function readIssues(value: unknown): Array<ApiIssue> {
  if (!Array.isArray(value)) return []
  return value.filter(isIssue)
}

function isIssue(value: unknown): value is ApiIssue {
  return (
    isRecord(value) &&
    typeof value.path === 'string' &&
    typeof value.message === 'string'
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
