'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PlanBadge } from '@/components/PlanBadge'
import {
  ChangePlanDocument,
  type BillingPageQuery,
  type PlanTier,
} from '@/lib/generated/graphql'
import { formatYen, gqlRequest } from '@/lib/gql'

type Props = {
  data: BillingPageQuery
}

export function BillingManager({ data }: Props) {
  const router = useRouter()
  const [currentTier, setCurrentTier] = useState(data.organization.planTier)
  const [message, setMessage] = useState<string | null>(null)

  async function selectPlan(tier: PlanTier) {
    setMessage(null)
    try {
      const result = await gqlRequest(ChangePlanDocument, { tier })
      setCurrentTier(result.changePlan.planTier)
      setMessage(`Plan changed to ${tier}.`)
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Plan change failed')
    }
  }

  const usage = data.usage

  return (
    <div className="billing-manager">
      <section className="panel">
        <h3>Usage</h3>
        <div className="usage-bars">
          <UsageBar label="Members" used={usage.members} limit={usage.membersLimit} />
          <UsageBar label="Patients" used={usage.patients} limit={usage.patientsLimit} />
          <UsageBar label="API calls" used={usage.apiCallsThisMonth} limit={usage.apiCallsLimit} />
        </div>
      </section>

      {message ? <p className="form-status">{message}</p> : null}

      <div className="plan-grid">
        {data.subscriptionPlans.map((plan) => {
          const active = plan.tier === currentTier
          return (
            <article key={plan.tier} className={`plan-card${active ? ' active' : ''}`}>
              <div className="plan-card-head">
                <PlanBadge tier={plan.tier} />
                {active ? <span className="plan-current">Current</span> : null}
              </div>
              <p className="plan-price">
                {plan.priceMonthly === 0 ? 'Free' : formatYen(plan.priceMonthly)}
                {plan.priceMonthly > 0 ? <span>/ month</span> : null}
              </p>
              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li key={f.key} className={f.included ? '' : 'muted'}>
                    {f.included ? '+' : '-'} {f.label}
                    {f.limit != null ? ` (${f.limit})` : ''}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={active ? 'btn-ghost' : 'btn-primary'}
                disabled={active}
                onClick={() => selectPlan(plan.tier as PlanTier)}
              >
                {active ? 'Selected' : 'Select plan'}
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0
  return (
    <div className="usage-bar">
      <div className="usage-bar-label">
        <span>{label}</span>
        <span className="mono">
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="usage-bar-track">
        <div className="usage-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
