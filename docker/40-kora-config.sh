#!/bin/sh
# Writes the runtime config read by the app (window.__KORA_CONFIG__).
# Runs on every container start, before nginx, via /docker-entrypoint.d.
set -eu

CONFIG_FILE=/usr/share/nginx/html/config.js
API_URL="${KORA_API_URL:-}"

if [ -z "$API_URL" ]; then
  echo "kora: KORA_API_URL not set; the app will use the build-time API URL" >&2
  printf 'window.__KORA_CONFIG__ = {}\n' > "$CONFIG_FILE"
  exit 0
fi

# Only plain http(s) URLs: anything else could break out of the JS string.
if ! printf '%s' "$API_URL" | grep -Eq '^https?://[A-Za-z0-9.:/_-]+$'; then
  echo "kora: invalid KORA_API_URL '$API_URL' (expected http(s)://host[:port][/path])" >&2
  exit 1
fi

printf 'window.__KORA_CONFIG__ = { "apiUrl": "%s" }\n' "${API_URL%/}" > "$CONFIG_FILE"
echo "kora: API URL set to ${API_URL%/}"
