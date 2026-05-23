const labels: Record<string, string> = {
  FREE: 'Free',
  STARTER: 'Starter',
  PRO: 'Pro',
  ENTERPRISE: 'Enterprise',
}

export function PlanBadge({ tier }: { tier: string }) {
  return <span className={`plan-badge plan-${tier.toLowerCase()}`}>{labels[tier] ?? tier}</span>
}

