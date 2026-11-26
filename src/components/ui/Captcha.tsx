import type { RefObject } from 'react'

type CaptchaProps = {
  /** Element the challenge provider (e.g. Turnstile) renders into. */
  containerRef: RefObject<HTMLDivElement | null>
  isEnabled: boolean
  hasLoadError?: boolean
}

/** Slot for an anti-bot widget. Renders nothing while captcha is off. */
export function Captcha({
  containerRef,
  isEnabled,
  hasLoadError,
}: CaptchaProps) {
  if (!isEnabled) return null

  if (hasLoadError)
    return (
      <p role="alert" className="text-danger text-center text-[13px]">
        Não foi possível carregar a verificação anti-robô. Recarregue a página.
      </p>
    )

  // Turnstile's widget is 65px tall; reserving it avoids a layout jump.
  return <div ref={containerRef} className="min-h-[65px] w-full" />
}
