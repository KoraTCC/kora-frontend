/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API (kora-backend), sem barra no final. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Set by /config.js (see public/config.js and docker/40-kora-config.sh).
// eslint-disable-next-line no-var
declare var __KORA_CONFIG__: unknown
