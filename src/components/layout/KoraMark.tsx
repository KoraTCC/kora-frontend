import { cn } from '#/lib/cn'

type KoraMarkProps = {
  className?: string
}

/** The Kora symbol (same geometry as public/favicon.svg, without the tile). */
export function KoraMark({ className }: KoraMarkProps) {
  return (
    <svg
      viewBox="280 248 464 528"
      aria-hidden
      className={cn('h-[30px] w-[26px] shrink-0', className)}
    >
      <path
        className="fill-lime"
        fillRule="evenodd"
        d="M512,255 737,383 737,641 512,769 287,641 287,383Z M512,356 646,434 646,590 512,667 378,590 378,434Z"
      />
      <circle className="fill-ink" cx="512" cy="512" r="38" />
    </svg>
  )
}
