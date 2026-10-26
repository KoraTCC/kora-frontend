type ClassValue = string | false | null | undefined

/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<ClassValue>): string {
  return classes.filter(Boolean).join(' ')
}
