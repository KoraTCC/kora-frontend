import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ZodType } from 'zod'
import type { FieldErrors } from '#/lib/formErrors'
import {
  getFormError,
  toFieldErrors,
  zodIssuesToApiIssues,
} from '#/lib/formErrors'

type UseSettingsFormOptions<TValues, TField extends string> = {
  schema: ZodType<TValues>
  fields: ReadonlyArray<TField>
  /** Turns the submitted form into the raw object the schema validates. */
  read: (form: FormData) => unknown
  save: (values: TValues) => Promise<unknown>
}

/**
 * One settings tab = one uncontrolled form. Submit validates with Zod and
 * saves; the top bar's "Descartar" is a native reset to the loaded values.
 */
export function useSettingsForm<TValues, TField extends string>({
  schema,
  fields,
  read,
  save,
}: UseSettingsFormOptions<TValues, TField>) {
  const mutation = useMutation({ mutationFn: save })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TField>>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = schema.safeParse(read(new FormData(event.currentTarget)))

    if (!parsed.success) {
      const issues = zodIssuesToApiIssues(parsed.error.issues)
      setFieldErrors(toFieldErrors(issues, fields))
      return
    }

    setFieldErrors({})
    mutation.mutate(parsed.data)
  }

  function handleReset() {
    setFieldErrors({})
    mutation.reset()
  }

  return {
    handleSubmit,
    handleReset,
    fieldErrors,
    formError: getFormError(mutation.error, fields),
    saveStatus: mutation.status,
  }
}

/** `FormData` holds checkbox values as `'on'` or nothing. */
export function readCheckbox(form: FormData, name: string): boolean {
  return form.get(name) === 'on'
}
