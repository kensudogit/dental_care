import {
  resolveApiUrl,
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

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** GET /api/status - Web to Go API connectivity check */
export async function GET() {
  const apiUrl = resolveApiUrl()
  const rawEnv = process.env.API_URL?.trim() ?? null

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
    apiUrlResolved: apiUrl,
    apiUrlEnv: rawEnv,
    apiUrlInvalid: isInvalidEnv(rawEnv),
    apiUrlUnresolvedTemplate: rawEnv ? isUnresolvedRailwayReference(rawEnv) : false,
    railway: Boolean(process.env.RAILWAY_PROJECT_ID),
    health,
  })
}
