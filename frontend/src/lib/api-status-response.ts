import { existsSync } from 'node:fs'
import {
  graphQLConnectionHint,
  isUnifiedDeploy,
  listApiBaseCandidates,
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
  const candidates = listApiBaseCandidates()
  const rawEnv = readApiUrlFromEnv() ?? null
  const envKeysFound = {
    API_URL: Boolean(process.env.API_URL?.trim()),
    'API URL': Boolean(process.env['API URL']?.trim()),
    NEXT_PUBLIC_API_URL: Boolean(process.env.NEXT_PUBLIC_API_URL?.trim()),
    UNIFIED_DEPLOY: Boolean(process.env.UNIFIED_DEPLOY?.trim()),
  }

  const attempts: Array<{
    url: string
    ok: boolean
    status?: number
    body?: unknown
    error?: string
  }> = []

  for (const base of candidates) {
    try {
      const res = await fetch(`${base}/health`, { cache: 'no-store' })
      const text = await res.text()
      let body: unknown = text
      try {
        body = JSON.parse(text)
      } catch {
        // plain text
      }
      attempts.push({ url: base, ok: res.ok, status: res.status, body })
      if (res.ok) break
    } catch (err) {
      attempts.push({
        url: base,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  const health = attempts.find((a) => a.ok) ?? attempts[0] ?? { url: candidates[0], ok: false }

  return Response.json({
    web: 'ok',
    railwayPublicDomain: process.env.RAILWAY_PUBLIC_DOMAIN ?? null,
    envKeysFound,
    unifiedDeploy: isUnifiedDeploy(),
    goBinaryPresent: existsSync('/app/server'),
    apiCandidates: candidates,
    apiUrlResolved: health.url ?? candidates[0] ?? null,
    apiUrlEnv: rawEnv,
    apiUrlInvalid: isInvalidEnv(rawEnv),
    apiUrlUnresolvedTemplate: rawEnv ? isUnresolvedRailwayReference(rawEnv) : false,
    railway: Boolean(process.env.RAILWAY_PROJECT_ID),
    hint: graphQLConnectionHint(),
    deployCommit: process.env.RAILWAY_GIT_COMMIT_SHA ?? null,
    health,
    healthAttempts: attempts,
  })
}
