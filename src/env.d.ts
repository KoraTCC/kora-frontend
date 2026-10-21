/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API (kora-backend), sem barra no final. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
