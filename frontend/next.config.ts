import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import { resolveApiUrl } from './src/lib/resolve-api-url'

const apiUrl = resolveApiUrl()
const root = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  outputFileTracingRoot: root,
  async rewrites() {
    // /graphql は app/graphql/route.ts でランタイムプロキシ（API_URL をビルド時に固定しない）
    return [
      { source: '/health', destination: `${apiUrl}/health` },
      // Legacy REST only — do NOT use /api/:path* (it steals /api/status from Next.js)
      { source: '/api/v1/:path*', destination: `${apiUrl}/api/v1/:path*` },
    ]
  },
}

export default nextConfig
