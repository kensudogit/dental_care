import { OrganizationForm } from '@/components/OrganizationForm'
import { PlanBadge } from '@/components/PlanBadge'
import { OrganizationSettingsDocument } from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

export const dynamic = 'force-dynamic'

export default async function OrganizationSettingsPage() {
  const data = await gqlRequest(OrganizationSettingsDocument)
  const org = data.organization

  return (
    <>
      <section className="panel saas-meta">
        <div>
          <p className="saas-eyebrow">Current plan</p>
          <PlanBadge tier={org.planTier} />
        </div>
        <div>
          <p className="saas-eyebrow">Members</p>
          <p className="mono">{org.memberCount}</p>
        </div>
        <div>
          <p className="saas-eyebrow">Created</p>
          <p className="mono">{new Date(org.createdAt).toLocaleDateString('ja-JP')}</p>
        </div>
      </section>
      <OrganizationForm
        initial={{
          name: org.name,
          slug: org.slug,
          chairCount: org.chairCount,
          timezone: org.timezone,
        }}
      />
    </>
  )
}

