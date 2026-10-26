/** "Ao vivo" marker for feeds that refresh on their own. */
export function LiveTag() {
  return (
    <span className="text-lime flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] whitespace-nowrap uppercase">
      <span
        aria-hidden
        className="bg-lime size-1.5 animate-pulse rounded-full"
      />
      Ao vivo
    </span>
  )
}
