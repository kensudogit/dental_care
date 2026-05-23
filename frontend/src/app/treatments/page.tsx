import { StatusBadge } from '@/components/StatusBadge'
import { TreatmentsPageDocument, type TreatmentsPageQuery } from '@/lib/generated/graphql'
import { formatYen, gqlRequest } from '@/lib/gql'

export const dynamic = 'force-dynamic'

export default async function TreatmentsPage() {
  let error: string | null = null
  let treatments: TreatmentsPageQuery['treatments'] = []

  try {
    const data = await gqlRequest(TreatmentsPageDocument)
    treatments = data.treatments
  } catch (e) {
    error = e instanceof Error ? e.message : 'GraphQL エラー'
  }

  const total = treatments.reduce((s, t) => s + t.fee, 0)

  return (
    <>
      <div className="page-head">
        <h2>診療記録</h2>
        <p>GraphQL Query <code>treatments</code> で処置・診断・料金を取得します。</p>
      </div>
      {error ? <div className="alert">{error}</div> : null}

      <section className="stat-grid" style={{ maxWidth: 400 }}>
        <article className="stat-card accent-emerald">
          <p className="stat-label">記録件数</p>
          <p className="stat-value">{treatments.length} 件</p>
        </article>
        <article className="stat-card accent-cyan">
          <p className="stat-label">合計料金（表示分）</p>
          <p className="stat-value">{formatYen(total)}</p>
        </article>
      </section>

      <section className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>来院日</th>
              <th>患者</th>
              <th>部位</th>
              <th>処置</th>
              <th>診断</th>
              <th>料金</th>
              <th>担当</th>
              <th>タグ</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((t) => (
              <tr key={t.id}>
                <td>{t.visitDate}</td>
                <td>{t.patientName ?? t.patientId}</td>
                <td>{t.tooth}</td>
                <td>{t.procedure}</td>
                <td>{t.diagnosis}</td>
                <td>{formatYen(t.fee)}</td>
                <td>{t.staff}</td>
                <td>{t.tags?.join(', ') ?? '—'}</td>
                <td>
                  <StatusBadge status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

