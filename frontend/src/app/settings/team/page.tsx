import { TeamManager } from '@/components/TeamManager'
import { TeamMembersDocument } from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

export const dynamic = 'force-dynamic'

export default async function TeamSettingsPage() {
  const data = await gqlRequest(TeamMembersDocument)
  return <TeamManager members={data.teamMembers} />
}
