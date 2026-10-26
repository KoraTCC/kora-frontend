/** Form readers: turn submitted `FormData` into the raw objects Zod validates. */

export function readEnabledNetworks(form: FormData) {
  return { enabledNetworks: form.getAll('enabledNetworks').map(String) }
}

export function readText(form: FormData, name: string): string {
  return String(form.get(name) ?? '')
}
