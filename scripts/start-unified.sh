#!/bin/sh
set -e

# Railway injects PORT for the public HTTP server (Next.js).
# Go API uses a separate internal port to avoid EADDRINUSE.
WEB_PORT="${PORT:-3000}"
API_PORT="${API_INTERNAL_PORT:-8081}"
export API_URL="http://127.0.0.1:${API_PORT}"

PORT="${API_PORT}" /app/server &
cd /app/frontend
exec npm start -- -p "${WEB_PORT}" -H 0.0.0.0
