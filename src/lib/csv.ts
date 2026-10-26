type CsvCell = string | number | null

/** Builds RFC 4180 CSV: quotes every cell and doubles inner quotes. */
export function toCsv(
  header: ReadonlyArray<string>,
  rows: ReadonlyArray<ReadonlyArray<CsvCell>>,
): string {
  return [header, ...rows].map((row) => row.map(toCsvCell).join(',')).join('\n')
}

function toCsvCell(value: CsvCell): string {
  const text = value === null ? '' : String(value)
  return `"${text.replace(/"/g, '""')}"`
}
