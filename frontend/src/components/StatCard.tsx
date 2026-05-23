type Props = {
  label: string
  value: string
  sub?: string
  accent?: 'cyan' | 'violet' | 'emerald' | 'amber'
}

export function StatCard({ label, value, sub, accent = 'cyan' }: Props) {
  return (
    <article className={`stat-card accent-${accent}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {sub ? <p className="stat-sub">{sub}</p> : null}
    </article>
  )
}
