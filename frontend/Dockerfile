# Unified Go API + Next.js for Railway (Root Directory = frontend)
# Builds Go from cloned monorepo; Next.js from this directory (build context).

FROM golang:1.22-alpine AS go-build
RUN apk add --no-cache git
WORKDIR /src
ARG REPO=https://github.com/kensudogit/dental_care.git
RUN git clone --depth 1 "${REPO}" repo
WORKDIR /src/repo
RUN if [ -n "${RAILWAY_GIT_COMMIT_SHA:-}" ]; then \
      git fetch --depth 1 origin "${RAILWAY_GIT_COMMIT_SHA}" && git checkout "${RAILWAY_GIT_COMMIT_SHA}"; \
    fi
WORKDIR /src/repo/backend
RUN go mod tidy && CGO_ENABLED=0 go build -o /server ./cmd/server

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
COPY --from=go-build /server /app/server
COPY --from=node-build /app/.next /app/frontend/.next
COPY --from=node-build /app/node_modules /app/frontend/node_modules
COPY --from=node-build /app/package.json /app/frontend/package.json
COPY --from=node-build /app/public /app/frontend/public
COPY docker/start-unified.sh /app/start.sh
RUN chmod +x /app/start.sh
ENV NODE_ENV=production
ENV API_INTERNAL_PORT=8081
ENV UNIFIED_DEPLOY=1
EXPOSE 3000
CMD ["/bin/sh", "/app/start.sh"]
