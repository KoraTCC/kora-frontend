/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API (kora-backend), sem barra no final. */
  readonly VITE_API_URL?: string
  /** Site key (pública) do Cloudflare Turnstile. Vazia = captcha desligado. */
  readonly VITE_TURNSTILE_SITE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
