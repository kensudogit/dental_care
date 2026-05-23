/**
 * Go API base URL (no trailing slash).
 * Railway: set API_URL on the Web service (dental_care), not on api.
 * Value must be the api service public URL, e.g. https://api-production-xxxx.up.railway.app
 */

function isRailway(): boolean {
  return Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
      process.env.RAILWAY_PROJECT_ID ||
      process.env.RAILWAY_SERVICE_ID,
  )
}

/** Read API URL from env (supports common Railway typos). */
export function readApiUrlFromEnv(): string | undefined {
  const keys = ['API_URL', 'API URL', 'NEXT_PUBLIC_API_URL'] as const
  for (const key of keys) {
    const v = process.env[key]?.trim()
    if (v) return v
  }
  return undefined
}

export function isUnresolvedRailwayReference(value: string): boolean {
  return value.includes('${{')
}

function isInvalidApiUrlEnv(value: string): boolean {
  const v = value.trim()
  if (!v) return true
  if (isUnresolvedRailwayReference(v)) return true
  const broken = ['https://', 'http://', 'https:', 'http:']
  if (broken.includes(v)) return true
  try {
    const u = new URL(v.startsWith('http') ? v : `https://${v}`)
    if (!u.hostname || u.hostname.length < 2) return true
    if (u.hostname === 'https' || u.hostname === 'http') return true
    return false
  } catch {
    return true
  }
}

function pointsToThisWebService(url: string): boolean {
  const own = process.env.RAILWAY_PUBLIC_DOMAIN?.trim()
  if (!own) return false
  try {
    const host = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    return host === own
  } catch {
    return url.includes(own)
  }
}

function normalizeApiUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '')
  if (isInvalidApiUrlEnv(trimmed)) {
    return ''
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
  const explicit = readApiUrlFromEnv()
  if (explicit) {
    const normalized = normalizeApiUrl(explicit)
    if (normalized && !pointsToThisWebService(normalized)) {
      return normalized
    }
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
  const raw = readApiUrlFromEnv()
  const target = resolveApiUrl()

  if (raw && pointsToThisWebService(normalizeApiUrl(raw) || raw)) {
    return (
      'API_URL is set to this Web app URL (' +
      raw +
      '). Delete it from the api service. On the dental_care (Web) service set API_URL ' +
      'to the api service URL (e.g. https://api-production-xxxx.up.railway.app). Name must be API_URL with underscore.'
    )
  }

  if (raw && process.env['API URL'] && !process.env.API_URL) {
    return (
      'Found variable "API URL" (with a space). Rename to API_URL (underscore) on the Web service, ' +
      'or redeploy after our latest code. Value must be the api public URL, not the Web URL.'
    )
  }

  if (raw && isInvalidApiUrlEnv(raw) && !isUnresolvedRailwayReference(raw)) {
    return (
      'API_URL is invalid (' +
      JSON.stringify(raw) +
      '). On Web service dental_care set API_URL to full api URL, e.g. https://api-production-xxxx.up.railway.app'
    )
  }

  if (raw && isUnresolvedRailwayReference(raw)) {
    return (
      'API_URL is still a Railway template. On Web service dental_care, set API_URL via Add Reference ' +
      'to api service RAILWAY_PUBLIC_DOMAIN with https:// prefix.'
    )
  }

  if (isProductionDeploy() && isRailway()) {
    return (
      'Tried ' +
      target +
      '. On Web service dental_care set API_URL to api public URL (Settings -> Networking on api service).'
    )
  }

  if (isProductionDeploy()) {
    return 'Tried ' + target + '. Set API_URL to the API public HTTPS URL (no trailing slash).'
  }

  return 'Local: run npm run dev from repository root so api (:8080) and web (:3000) both start.'
}
