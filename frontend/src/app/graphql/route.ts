import { resolveApiUrl } from '@/lib/resolve-api-url'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function proxy(request: Request): Promise<Response> {
  const apiBase = resolveApiUrl()
  const target = `${apiBase}/graphql${new URL(request.url).search}`

  const headers = new Headers()
  const contentType = request.headers.get('content-type')
  if (contentType) {
    headers.set('content-type', contentType)
  }
  const accept = request.headers.get('accept')
  if (accept) {
    headers.set('accept', accept)
  }

  let upstream: Response
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : await request.text(),
      cache: 'no-store',
    })
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    return Response.json(
      {
        errors: [
          {
            message: `API ???????? (${apiBase}): ${detail}`,
          },
        ],
      },
      { status: 502, headers: { 'content-type': 'application/json' } },
    )
  }

  const body = await upstream.text()
  const outHeaders = new Headers()
  const upstreamType = upstream.headers.get('content-type')
  if (upstreamType) {
    outHeaders.set('content-type', upstreamType)
  } else if (body.trimStart().startsWith('{') || body.trimStart().startsWith('[')) {
    outHeaders.set('content-type', 'application/json')
  }

  return new Response(body, { status: upstream.status, headers: outHeaders })
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
