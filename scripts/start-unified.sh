#!/bin/sh
set -e

export PORT="${PORT:-3000}"
export API_URL="http://127.0.0.1:8080"

PORT=8080 /app/server &
cd /app/frontend
exec npm start -- -p "$PORT" -H 0.0.0.0
