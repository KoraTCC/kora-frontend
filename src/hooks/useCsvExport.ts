import { useCallback } from 'react'
import { toCsv } from '#/lib/csv'
import { useFileDownload } from './useFileDownload'

type CsvCell = string | number | null

/** Saves rows as a UTF-8 CSV file. */
export function useCsvExport() {
  const download = useFileDownload()

  return useCallback(
    (
      filename: string,
      header: ReadonlyArray<string>,
      rows: ReadonlyArray<ReadonlyArray<CsvCell>>,
    ) => {
      download(filename, toCsv(header, rows), 'text/csv;charset=utf-8')
    },
    [download],
  )
}
