# Unified Go API + Next.js for Railway (Root Directory = frontend)
# Go binary is pre-built for linux/amd64 (see scripts/build-linux-server.ps1).

FROM node:22-alpine AS node-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS node-build
WORKDIR /app
COPY --from=node-deps /app/node_modules ./node_modules
COPY . .
ENV UNIFIED_DEPLOY=1
RUN npm run build:docker

FROM node:22-alpine
RUN apk add --no-cache ca-certificates curl
WORKDIR /app
COPY bin/dental-care-server /app/server
RUN chmod +x /app/server
COPY --from=node-build /app/.next /app/frontend/.next
COPY --from=node-build /app/node_modules /app/frontend/node_modules
COPY --from=node-build /app/package.json /app/frontend/package.json
COPY --from=node-build /app/public /app/frontend/public
COPY docker/start-unified.sh /app/start.sh
RUN chmod +x /app/start.sh
ENV NODE_ENV=production
ENV API_INTERNAL_PORT=8081
ENV UNIFIED_DEPLOY=1
ENV APP_BUILD_ID=unified-frontend-v5-external-api
EXPOSE 3000
CMD ["/bin/sh", "/app/start.sh"]
