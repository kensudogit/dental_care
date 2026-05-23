import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { resolveApiUrl } from '@/lib/resolve-api-url'

/** Browser → Next proxy. Server (RSC) → Go API directly (avoids dev self-fetch issues). */
function gqlUrl(): string {
  if (typeof window !== 'undefined') {
    return '/graphql'
  }
  return `${resolveApiUrl()}/graphql`
}

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
      `API が JSON 以外を返しました (HTTP ${res.status}): ${preview}`,
    )
  }
}

export async function gqlRequest<TResult, TVariables = Record<string, never>>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  const res = await fetch(gqlUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      query: print(document),
      variables: variables ?? {},
    }),
    cache: 'no-store',
  })

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
