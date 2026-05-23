# Web (Next.js) — build context MUST be repository root (dental_care/)
# Railway Web service: Root Directory = empty (NOT frontend/)
# docker compose: context: .  dockerfile: Dockerfile

FROM node:22-alpine AS deps
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app/frontend
COPY --from=deps /app/frontend/node_modules ./node_modules
COPY graphql ../graphql
COPY frontend/ ./
ARG API_URL=http://localhost:8080
ENV API_URL=$API_URL
RUN npm run build:docker

FROM node:22-alpine
WORKDIR /app/frontend
ENV NODE_ENV=production
# API_URL ? Railway ? Variables ????????????? localhost ???????
COPY --from=build /app/frontend/.next ./.next
COPY --from=build /app/frontend/node_modules ./node_modules
COPY --from=build /app/frontend/package.json ./
COPY --from=build /app/frontend/public ./public
EXPOSE 3000
CMD ["npm", "start"]
