/**
 * Go API base URL (no trailing slash).
 * Railway Web: API_URL must be a full URL, e.g. https://your-api.up.railway.app
 * Do NOT set API_URL to only "https://". Use Add Reference for the full domain.
 */

function isRailway(): boolean {
  return Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
      process.env.RAILWAY_PROJECT_ID ||
      process.env.RAILWAY_SERVICE_ID,
  )
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
  const explicit = process.env.API_URL?.trim()
  if (explicit) {
    const normalized = normalizeApiUrl(explicit)
    if (normalized) {
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
  const raw = process.env.API_URL?.trim()
  const target = resolveApiUrl()

  if (raw && isInvalidApiUrlEnv(raw) && !isUnresolvedRailwayReference(raw)) {
    return (
      'API_URL is invalid (' +
      JSON.stringify(raw) +
      '). Set the full URL, e.g. https://YOUR-API.up.railway.app - not only "https://". ' +
      'In Railway Variables: delete API_URL, add it again with Add Reference to your API service ' +
      'RAILWAY_PUBLIC_DOMAIN, and type https:// before the reference chip.'
    )
  }

  if (raw && isUnresolvedRailwayReference(raw)) {
    return (
      'API_URL is still a Railway template. Add an API service (Root Directory: backend), ' +
      'then set API_URL via Add Reference to that service RAILWAY_PUBLIC_DOMAIN with https:// prefix.'
    )
  }

  if (isProductionDeploy() && isRailway()) {
    return (
      'Tried ' +
      target +
      '. Set API_URL to the full API public URL (copy from API service Settings -> Networking -> Public URL).'
    )
  }

  if (isProductionDeploy()) {
    return 'Tried ' + target + '. Set API_URL to the API public HTTPS URL (no trailing slash).'
  }

  return 'Local: run npm run dev from repository root so api (:8080) and web (:3000) both start.'
}
