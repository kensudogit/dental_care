import { PlanBadge } from '@/components/PlanBadge'
import { RoleBadge } from '@/components/RoleBadge'
import { StatCard } from '@/components/StatCard'
import { SettingsOverviewDocument } from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

export const dynamic = 'force-dynamic'

function pct(used: number, limit: number) {
  if (limit <= 0) return 0
  return Math.min(100, Math.round((used / limit) * 100))
}

export default async function SettingsOverviewPage() {
  let data
  try {
    data = await gqlRequest(SettingsOverviewDocument)
  } catch {
    return <div className="alert">Failed to load settings data.</div>
  }

  const { currentSession: session, usage } = data
  const org = session.organization

  return (
    <>
      <section className="panel saas-hero">
        <div className="saas-hero-grid">
          <div>
            <p className="saas-eyebrow">Signed in as</p>
            <h3>{session.user.name}</h3>
            <p className="muted">{session.user.email}</p>
            <RoleBadge role={session.role} />
          </div>
          <div className="saas-org-card">
            <p className="saas-eyebrow">Organization</p>
            <h3>{org.name}</h3>
            <p className="muted mono">{org.slug}</p>
            <PlanBadge tier={org.planTier} />
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <StatCard
          label="Team members"
          value={`${usage.members} / ${usage.membersLimit}`}
          sub={`Usage ${pct(usage.members, usage.membersLimit)}%`}
          accent="cyan"
        />
        <StatCard
          label="Patients"
          value={`${usage.patients} / ${usage.patientsLimit}`}
          sub={`Usage ${pct(usage.patients, usage.patientsLimit)}%`}
          accent="violet"
        />
        <StatCard
          label="API calls (month)"
          value={usage.apiCallsThisMonth.toLocaleString()}
          sub={`Limit ${usage.apiCallsLimit.toLocaleString()}`}
          accent="emerald"
        />
        <StatCard
          label="Chairs"
          value={`${org.chairCount}`}
          sub={`Status: ${org.subscriptionStatus}`}
          accent="amber"
        />
      </section>

      <section className="panel">
        <h3>B2B SaaS capabilities</h3>
        <ul className="feature-list">
          <li>Multi-tenant organizations (clinic-scoped data)</li>
          <li>Role-based access (Owner / Admin / Member / Viewer)</li>
          <li>Subscription plans (Free through Enterprise)</li>
          <li>Usage metering (members, patients, API)</li>
          <li>API keys for B2B integrations</li>
          <li>Audit log for compliance</li>
        </ul>
      </section>
    </>
  )
}


