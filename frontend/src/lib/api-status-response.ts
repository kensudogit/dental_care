import {
  resolveApiUrl,
  readApiUrlFromEnv,
  isUnresolvedRailwayReference,
} from '@/lib/resolve-api-url'

function isInvalidEnv(value: string | null): boolean {
  if (!value?.trim()) return true
  const v = value.trim()
  return (
    v === 'https://' ||
    v === 'http://' ||
    v === 'https:' ||
    v === 'http:' ||
    isUnresolvedRailwayReference(v)
  )
}

export async function buildApiStatusResponse(): Promise<Response> {
  const apiUrl = resolveApiUrl()
  const rawEnv = readApiUrlFromEnv() ?? null
  const envKeysFound = {
    API_URL: Boolean(process.env.API_URL?.trim()),
    'API URL': Boolean(process.env['API URL']?.trim()),
    NEXT_PUBLIC_API_URL: Boolean(process.env.NEXT_PUBLIC_API_URL?.trim()),
  }

  let health: { ok: boolean; status?: number; body?: unknown; error?: string } = {
    ok: false,
  }

  try {
    const res = await fetch(`${apiUrl}/health`, { cache: 'no-store' })
    const text = await res.text()
    let body: unknown = text
    try {
      body = JSON.parse(text)
    } catch {
      // plain text
    }
    health = { ok: res.ok, status: res.status, body }
  } catch (err) {
    health = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }

  return Response.json({
    web: 'ok',
    railwayPublicDomain: process.env.RAILWAY_PUBLIC_DOMAIN ?? null,
    envKeysFound,
    apiUrlResolved: apiUrl,
    apiUrlEnv: rawEnv,
    apiUrlInvalid: isInvalidEnv(rawEnv),
    apiUrlUnresolvedTemplate: rawEnv ? isUnresolvedRailwayReference(rawEnv) : false,
    railway: Boolean(process.env.RAILWAY_PROJECT_ID),
    health,
  })
}
