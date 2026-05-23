import { BillingManager } from '@/components/BillingManager'
import { BillingPageDocument } from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

export const dynamic = 'force-dynamic'

export default async function BillingSettingsPage() {
  const data = await gqlRequest(BillingPageDocument)
  return <BillingManager data={data} />
}
