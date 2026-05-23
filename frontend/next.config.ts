import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const apiUrl = process.env.API_URL ?? 'http://localhost:8080'
const root = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  outputFileTracingRoot: root,
  async rewrites() {
    return [
      { source: '/health', destination: `${apiUrl}/health` },
      { source: '/graphql', destination: `${apiUrl}/graphql` },
      { source: '/graphql/:path*', destination: `${apiUrl}/graphql/:path*` },
      { source: '/api/:path*', destination: `${apiUrl}/api/:path*` },
    ]
  },
}

export default nextConfig
