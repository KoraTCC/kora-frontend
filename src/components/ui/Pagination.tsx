import { cn } from '#/lib/cn'

type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  /** e.g. "Mostrando 20 de 148 cobranças". */
  summary: string
}

const MAX_PAGE_BUTTONS = 3

const BUTTON_CLASSES =
  'border-line-strong bg-surface-2 text-muted hover:text-ink focus-visible:ring-lime/25 inline-flex min-h-11 min-w-11 items-center justify-center rounded-[7px] border px-3 font-mono text-[10px] transition focus-visible:ring-3 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 lg:min-h-8 lg:min-w-8'

export function Pagination({
  page,
  pageCount,
  onPageChange,
  summary,
}: PaginationProps) {
  const pages = getVisiblePages(page, pageCount)

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-muted text-[11px]">{summary}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          className={BUTTON_CLASSES}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ← Anterior
        </button>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            aria-current={pageNumber === page ? 'page' : undefined}
            className={cn(
              BUTTON_CLASSES,
              pageNumber === page && 'border-lime-line text-lime bg-lime-bg',
            )}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          className={BUTTON_CLASSES}
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima →
        </button>
      </div>
    </nav>
  )
}

/** A small window of page numbers around the current one. */
export function getVisiblePages(
  page: number,
  pageCount: number,
): Array<number> {
  const count = Math.min(MAX_PAGE_BUTTONS, pageCount)
  const start = Math.min(
    Math.max(1, page - Math.floor(count / 2)),
    Math.max(1, pageCount - count + 1),
  )
  return Array.from({ length: count }, (_, offset) => start + offset)
}
