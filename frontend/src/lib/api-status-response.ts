import { existsSync } from 'node:fs'
import { executeEmbeddedGraphQL } from '@/lib/embedded-api/execute'
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

  const goHealth = attempts.find((a) => a.ok)
  const apiVersion =
    goHealth?.body && typeof goHealth.body === 'object' && goHealth.body !== null
      ? (goHealth.body as { version?: string }).version ?? null
      : null
  const apiSchemaStale = apiVersion === '1.0.0' || apiVersion === '1.0'
  const embeddedHealth = executeEmbeddedGraphQL('{ health { ok service version } }')
  const embeddedOk =
    (embeddedHealth.data?.health as { ok?: boolean } | undefined)?.ok === true

  return Response.json({
    web: 'ok',
    buildId: process.env.APP_BUILD_ID ?? 'unknown',
    embeddedApi: true,
    embeddedHealth: embeddedHealth.data?.health ?? null,
    railwayPublicDomain: process.env.RAILWAY_PUBLIC_DOMAIN ?? null,
    envKeysFound,
    unifiedDeploy: isUnifiedDeploy(),
    goBinaryPresent: existsSync('/app/server'),
    apiCandidates: candidates,
    apiUrlResolved: goHealth?.url ?? attempts[0]?.url ?? candidates[0] ?? null,
    apiUrlEnv: rawEnv,
    apiUrlInvalid: isInvalidEnv(rawEnv),
    apiUrlUnresolvedTemplate: rawEnv ? isUnresolvedRailwayReference(rawEnv) : false,
    railway: Boolean(process.env.RAILWAY_PROJECT_ID),
    hint: goHealth
      ? apiSchemaStale
        ? 'API is reachable but on an old schema (version ' +
          apiVersion +
          '). Redeploy the **api** service from latest main for pagination and clinical features.'
        : graphQLConnectionHint()
      : 'Using embedded GraphQL API (Go API unavailable).',
    deployCommit: process.env.RAILWAY_GIT_COMMIT_SHA ?? null,
    apiVersion,
    apiSchemaStale,
    health: goHealth ?? {
      ok: embeddedOk,
      source: embeddedOk ? 'embedded' : 'none',
      error: embeddedOk ? undefined : attempts[0]?.error,
    },
    healthAttempts: attempts,
  })
}
