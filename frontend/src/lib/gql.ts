import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

const GQL_URL =
  typeof window === 'undefined'
    ? `${process.env.API_URL ?? 'http://localhost:8080'}/graphql`
    : '/graphql'

export class GraphQLClientError extends Error {
  constructor(
    message: string,
    public readonly errors?: { message: string }[],
  ) {
    super(message)
    this.name = 'GraphQLClientError'
  }
}

export async function gqlRequest<TResult, TVariables = Record<string, never>>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: print(document),
      variables: variables ?? {},
    }),
    cache: 'no-store',
  })

  const json = (await res.json()) as {
    data?: TResult
    errors?: { message: string }[]
  }

  if (!res.ok || json.errors?.length) {
    throw new GraphQLClientError(
      json.errors?.[0]?.message ?? `GraphQL HTTP ${res.status}`,
      json.errors,
    )
  }

  if (!json.data) {
    throw new GraphQLClientError('Empty GraphQL response')
  }

  return json.data
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
