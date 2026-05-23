import { listApiBaseCandidates } from '@/lib/resolve-api-url'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function proxy(request: Request): Promise<Response> {
  const bases = listApiBaseCandidates()
  const search = new URL(request.url).search

  const headers = new Headers()
  const contentType = request.headers.get('content-type')
  if (contentType) {
    headers.set('content-type', contentType)
  }
  const accept = request.headers.get('accept')
  if (accept) {
    headers.set('accept', accept)
  }

  const body =
    request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await request.text()

  const failures: string[] = []
  for (const base of bases) {
    const target = `${base}/graphql${search}`
    try {
      const upstream = await fetch(target, {
        method: request.method,
        headers,
        body,
        cache: 'no-store',
      })

      const text = await upstream.text()
      const outHeaders = new Headers()
      const upstreamType = upstream.headers.get('content-type')
      if (upstreamType) {
        outHeaders.set('content-type', upstreamType)
      } else if (text.trimStart().startsWith('{') || text.trimStart().startsWith('[')) {
        outHeaders.set('content-type', 'application/json')
      }

      return new Response(text, { status: upstream.status, headers: outHeaders })
    } catch (err) {
      failures.push(`${base}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return Response.json(
    {
      errors: [
        {
          message: `Cannot reach API (${failures.join('; ')})`,
        },
      ],
    },
    { status: 502, headers: { 'content-type': 'application/json' } },
  )
}

export async function GET(request: Request) {
  return proxy(request)
}

export async function POST(request: Request) {
  return proxy(request)
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type, accept',
    },
  })
}
