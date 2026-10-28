# Production image: static SPA served by an unprivileged nginx.
#   docker build -t kora-frontend .
#   docker run -e KORA_API_URL=https://api.example.com -p 8080:8080 kora-frontend

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/client /usr/share/nginx/html
COPY --chmod=755 docker/40-kora-config.sh /docker-entrypoint.d/40-kora-config.sh
# The entrypoint rewrites config.js as the non-root nginx user.
USER root
RUN chown nginx:nginx /usr/share/nginx/html/config.js
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz > /dev/null || exit 1
