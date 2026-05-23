/**
 * Go API base URL (no trailing slash).
 *
 * Priority:
 * 1. API_URL (Railway: https://${{api.RAILWAY_PUBLIC_DOMAIN}})
 * 2. On Railway without API_URL: private network (api.railway.internal:PORT)
 * 3. Local: http://localhost:8080
 */

function isRailway(): boolean {
  return Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
      process.env.RAILWAY_PROJECT_ID ||
      process.env.RAILWAY_SERVICE_ID,
  )
}

function normalizeApiUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '')
  if (!trimmed) {
    return 'http://localhost:8080'
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  if (trimmed.includes('.railway.internal') || trimmed.includes('localhost')) {
    return `http://${trimmed}`
  }
  return `https://${trimmed}`
}

function railwayInternalApiUrl(): string {
  const host =
    process.env.API_INTERNAL_HOST?.trim() ||
    process.env.RAILWAY_SERVICE_API_HOST?.trim() ||
    'api.railway.internal'
  const port =
    process.env.API_INTERNAL_PORT?.trim() ||
    process.env.API_PORT?.trim() ||
    '8080'
  return `http://${host}:${port}`
}

export function resolveApiUrl(): string {
  const explicit = process.env.API_URL?.trim()
  if (explicit) {
    return normalizeApiUrl(explicit)
  }

  if (isRailway()) {
    return railwayInternalApiUrl()
  }

  return 'http://localhost:8080'
}

export function isProductionDeploy(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function graphQLConnectionHint(): string {
  if (isProductionDeploy() && isRailway()) {
    return (
      'Railway Web: set API_URL to https://${{api.RAILWAY_PUBLIC_DOMAIN}} ' +
      '(api = your API service name). Or set API_INTERNAL_HOST / API_INTERNAL_PORT ' +
      'if the API service is not named "api". Ensure the API service is deployed and GET /health works.'
    )
  }
  if (isProductionDeploy()) {
    return 'Set API_URL to your API public URL (https://..., no trailing slash).'
  }
  return (
    'Local: run npm run dev from the repository root (dental_care) so both api (:8080) ' +
    'and web (:3000) start. npm run dev inside frontend/ alone does not start the API.'
  )
}
