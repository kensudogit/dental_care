/**
 * Go API base URL (no trailing slash).
 * Railway: set API_URL on the Web service (see docs/RAILWAY.md).
 */

function isRailway(): boolean {
  return Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
      process.env.RAILWAY_PROJECT_ID ||
      process.env.RAILWAY_SERVICE_ID,
  )
}

/** Railway reference syntax left unexpanded (wrong service name or typo). */
export function isUnresolvedRailwayReference(value: string): boolean {
  return value.includes('${{')
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
  if (explicit && !isUnresolvedRailwayReference(explicit)) {
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
  const raw = process.env.API_URL?.trim()
  const target = resolveApiUrl()

  if (raw && isUnresolvedRailwayReference(raw)) {
    return (
      'API_URL is still a Railway template (' +
      raw +
      '). Add a Go API service (Root Directory: backend). On the Web service, ' +
      'edit API_URL using Add Reference to that service RAILWAY_PUBLIC_DOMAIN with https prefix.'
    )
  }

  if (isProductionDeploy() && isRailway()) {
    return (
      'Tried ' +
      target +
      '. Deploy a separate API service (backend/, GET /health). ' +
      'Set API_URL on the Web service to the API public HTTPS URL.'
    )
  }

  if (isProductionDeploy()) {
    return 'Tried ' + target + '. Set API_URL to the API public HTTPS URL (no trailing slash).'
  }

  return 'Local: run npm run dev from repository root so api (:8080) and web (:3000) both start.'
}
