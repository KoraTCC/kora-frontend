/** `Bom dia, Gustavo.` — greeting by the hour of `now`. */
export function getGreeting(fullName: string, now: Date = new Date()): string {
  const firstName = fullName.trim().split(/\s+/)[0] ?? ''
  return `${getPeriodGreeting(now.getHours())}, ${firstName}.`
}

function getPeriodGreeting(hour: number): string {
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}
