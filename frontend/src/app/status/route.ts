import { buildApiStatusResponse } from '@/lib/api-status-response'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return buildApiStatusResponse()
}
