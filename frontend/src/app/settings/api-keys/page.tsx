import { ApiKeyManager } from '@/components/ApiKeyManager'
import { ApiKeysPageDocument } from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

export const dynamic = 'force-dynamic'

export default async function ApiKeysSettingsPage() {
  const data = await gqlRequest(ApiKeysPageDocument)
  return <ApiKeyManager keys={data.apiKeys} />
}
