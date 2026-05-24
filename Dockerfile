# All-in-one: Go API + Next.js for Railway (Root Directory = repo root)

FROM golang:1.22-alpine AS go-build
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum* ./
RUN go mod download 2>/dev/null || true
COPY backend/ .
RUN go mod tidy && CGO_ENABLED=0 go build -o /server ./cmd/server

FROM node:22-alpine AS node-deps
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS node-build
WORKDIR /app/frontend
COPY --from=node-deps /app/frontend/node_modules ./node_modules
COPY graphql ../graphql
COPY frontend/ ./
ENV UNIFIED_DEPLOY=1
RUN npm run build:docker

FROM node:22-alpine
RUN apk add --no-cache ca-certificates curl
WORKDIR /app
COPY --from=go-build /server /app/server
COPY --from=node-build /app/frontend/.next /app/frontend/.next
COPY --from=node-build /app/frontend/node_modules /app/frontend/node_modules
COPY --from=node-build /app/frontend/package.json /app/frontend/package.json
COPY --from=node-build /app/frontend/public /app/frontend/public
COPY scripts/start-unified.sh /app/start.sh
RUN chmod +x /app/start.sh /app/server
ENV NODE_ENV=production
ENV API_INTERNAL_PORT=8081
ENV UNIFIED_DEPLOY=1
ENV APP_BUILD_ID=unified-root-v8-clinical-fallback
EXPOSE 3000
CMD ["/bin/sh", "/app/start.sh"]
