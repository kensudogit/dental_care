import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import { resolveApiUrl } from './src/lib/resolve-api-url'

const apiUrl = resolveApiUrl()
const root = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  outputFileTracingRoot: root,
  async rewrites() {
    // afterFiles: App Router (/status, /api/status, pages) wins over these rewrites
    return {
      afterFiles: [
        { source: '/health', destination: `${apiUrl}/health` },
        { source: '/api/v1/:path*', destination: `${apiUrl}/api/v1/:path*` },
      ],
    }
  },
}

export default nextConfig
