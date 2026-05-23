# Web (Next.js) — build context = frontend/ (Railway Root Directory: frontend)
# Dashboard: Config file path → /frontend/railway.toml
#
# If Root Directory is empty, use repository root Dockerfile instead.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG API_URL=http://localhost:8080
ENV API_URL=$API_URL
# Generated types are committed; skip codegen (needs ../graphql when run locally).
RUN npm run build:docker

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
# API_URL は Railway の Variables で実行時に注入
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
