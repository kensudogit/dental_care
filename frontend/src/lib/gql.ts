import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
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

  const bases =
    typeof window !== 'undefined' ? ['/graphql'] : listApiBaseCandidates().map((b) => `${b}/graphql`)

  const failures: string[] = []
  for (const url of bases) {
    try {
      return await fetch(url, init)
    } catch (err) {
      failures.push(`${url}: ${err instanceof Error ? err.message : String(err)}`)
    }
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

  if (!res.ok || json.errors?.length) {
    throw new GraphQLClientError(
      json.errors?.[0]?.message ?? `GraphQL HTTP ${res.status}`,
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
