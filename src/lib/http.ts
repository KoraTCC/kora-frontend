import type { ZodType } from 'zod'
import { resolveApiUrl } from './config'

const API_URL = resolveApiUrl(
  globalThis.__KORA_CONFIG__,
  import.meta.env.VITE_API_URL,
)

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

/** Rotas em que um 401 é a resposta final, não um access token vencido. */
const NO_REFRESH_PATHS = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
])

let pendingRefresh: Promise<void> | null = null

/**
 * Tokens vivem em cookies httpOnly da API, então toda chamada vai com
 * `credentials: 'include'` e nada de autenticação passa pelo JavaScript.
 */
export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, schema }: RequestOptions<T>,
): Promise<T> {
  const response = await sendWithRefresh(path, method, body)
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) throw toApiError(response.status, payload)

  const parsed = schema.safeParse(payload)
  if (!parsed.success) {
    throw new ApiError(response.status, 'Resposta inesperada da API.')
  }
  return parsed.data
}

/**
 * O access token dura poucos minutos. No primeiro 401, renova a sessão com o
 * refresh token (outro cookie httpOnly) e repete a requisição uma vez.
 */
async function sendWithRefresh(path: string, method: string, body: unknown) {
  const response = await sendRequest(path, method, body)
  if (response.status !== 401 || NO_REFRESH_PATHS.has(path)) return response

  await refreshSession()
  return sendRequest(path, method, body)
}

/**
 * Uma renovação por vez: requisições que falham juntas esperam a mesma.
 * Renovar duas vezes com o mesmo token faria a API ver um reuso.
 * O resultado não importa aqui: se falhou, a repetição devolve o 401.
 */
function refreshSession(): Promise<void> {
  pendingRefresh ??= sendRequest('/auth/refresh', 'POST', undefined)
    .then(() => undefined)
    .catch(() => undefined)
    .finally(() => {
      pendingRefresh = null
    })
  return pendingRefresh
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
