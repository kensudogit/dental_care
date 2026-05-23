import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { executeEmbeddedGraphQL } from '@/lib/embedded-api/execute'
import { isLegacySchemaError } from '@/lib/graphql-fallback'
import { fetchLegacyGraphQL } from '@/lib/legacy-graphql/fetch'
import { listApiBaseCandidates } from '@/lib/resolve-api-url'

export class GraphQLClientError extends Error {
  constructor(
    message: string,
    public readonly errors?: { message: string }[],
  ) {
    super(message)
    this.name = 'GraphQLClientError'
  }
}

async function parseJsonBody(res: Response): Promise<{
  data?: unknown
  errors?: { message: string }[]
}> {
  const text = await res.text()
  if (!text.trim()) {
    throw new GraphQLClientError(`Empty response (HTTP ${res.status})`)
  }
  try {
    return JSON.parse(text) as { data?: unknown; errors?: { message: string }[] }
  } catch {
    const preview = text.replace(/\s+/g, ' ').slice(0, 160)
    throw new GraphQLClientError(
      `API returned non-JSON (HTTP ${res.status}): ${preview}`,
    )
  }
}

async function postGraphQL(body: string): Promise<Response> {
  const init: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body,
    cache: 'no-store',
  }

  const urls =
    typeof window !== 'undefined'
      ? ['/graphql']
      : [...listApiBaseCandidates().map((b) => `${b}/graphql`), 'embedded://local']

  const failures: string[] = []
  for (const url of urls) {
    if (url === 'embedded://local') {
      const payload = JSON.parse(body) as { query: string; variables?: Record<string, unknown> }
      const result = executeEmbeddedGraphQL(payload.query, payload.variables ?? {})
      return new Response(JSON.stringify(result), {
        status: result.errors?.length ? 400 : 200,
        headers: { 'content-type': 'application/json' },
      })
    }
    try {
      const res = await fetch(url, init)
      if (res.ok) return res
      const text = await res.text()
      if (res.status === 502 || res.status === 503) {
        failures.push(`${url}: HTTP ${res.status}`)
        continue
      }
      return new Response(text, { status: res.status, headers: res.headers })
    } catch (err) {
      failures.push(`${url}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const payload = JSON.parse(body) as { query: string; variables?: Record<string, unknown> }
  const result = executeEmbeddedGraphQL(payload.query, payload.variables ?? {})
  if (result.data) {
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'content-type': 'application/json', 'x-graphql-source': 'embedded' },
    })
  }

  throw new GraphQLClientError(`fetch failed (${failures.join('; ')})`)
}

export async function gqlRequest<TResult, TVariables = Record<string, never>>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  const body = JSON.stringify({
    query: print(document),
    variables: variables ?? {},
  })

  const res = await postGraphQL(body)
  const json = await parseJsonBody(res)

  if (json.errors?.length) {
    if (isLegacySchemaError(json.errors)) {
      const payload = JSON.parse(body) as { query: string; variables?: Record<string, unknown> }
      const legacy = await fetchLegacyGraphQL(payload.query, payload.variables ?? {})
      if (legacy?.data && !legacy.errors?.length) {
        return legacy.data as TResult
      }
      const embedded = executeEmbeddedGraphQL(payload.query, payload.variables ?? {})
      if (embedded.data && !embedded.errors?.length) {
        return embedded.data as TResult
      }
    }
    throw new GraphQLClientError(
      json.errors[0]?.message ?? `GraphQL HTTP ${res.status}`,
      json.errors,
    )
  }

  if (!json.data) {
    throw new GraphQLClientError('Empty GraphQL response')
  }

  return json.data as TResult
}

export function formatYen(n: number) {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(n)
}

export function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso.slice(11, 16)
  }
}
