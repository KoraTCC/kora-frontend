import { ApiError } from './http'
import type { ApiIssue } from './http'

export type FieldErrors<TField extends string> = Partial<Record<TField, string>>

const UNEXPECTED_ERROR = 'Algo deu errado. Tente novamente.'

/** Converte issues (do zod ou da API) em um erro por campo conhecido. */
export function toFieldErrors<TField extends string>(
  issues: ReadonlyArray<ApiIssue>,
  fields: ReadonlyArray<TField>,
): FieldErrors<TField> {
  const errors: FieldErrors<TField> = {}
  for (const { path, message } of issues) {
    if (!isField(path, fields) || errors[path]) continue
    errors[path] = message
  }
  return errors
}

export function zodIssuesToApiIssues(
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>,
): Array<ApiIssue> {
  return issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    message: issue.message,
  }))
}

/** Erros de campo já aparecem no próprio campo; aqui só o que sobra. */
export function getFormError<TField extends string>(
  error: Error | null,
  fields: ReadonlyArray<TField>,
): string | undefined {
  if (!error) return undefined
  if (!(error instanceof ApiError)) return UNEXPECTED_ERROR
  if (error.issues.some((issue) => isField(issue.path, fields)))
    return undefined
  return error.message
}

function isField<TField extends string>(
  path: string,
  fields: ReadonlyArray<TField>,
): path is TField {
  return (fields as ReadonlyArray<string>).includes(path)
}
