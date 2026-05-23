import { StatusBadge } from '@/components/StatusBadge'
import { AppointmentsPageDocument, type AppointmentsPageQuery } from '@/lib/generated/graphql'
import { formatTime, gqlRequest } from '@/lib/gql'

export const dynamic = 'force-dynamic'

export default async function AppointmentsPage() {
  let error: string | null = null
  let appointments: AppointmentsPageQuery['appointments'] = []

  try {
    const data = await gqlRequest(AppointmentsPageDocument)
    appointments = data.appointments
  } catch (e) {
    error = e instanceof Error ? e.message : 'GraphQL エラー'
  }

  const byChair = [1, 2, 3].map((chair) => ({
    chair,
    items: appointments.filter((a) => a.chair === chair),
  }))

  return (
    <>
      <div className="page-head">
        <h2>予約・診療台</h2>
        <p>GraphQL Query <code>appointments(date)</code> でスケジュールを取得します。</p>
      </div>
      {error ? <div className="alert">{error}</div> : null}

      <div className="split">
        {byChair.map(({ chair, items }) => (
          <section key={chair} className="panel">
            <h3>チェア {chair}</h3>
            {items.length === 0 ? (
              <p className="panel-empty">予約なし</p>
            ) : (
              <ul className="appt-list">
                {items.map((a) => (
                  <li key={a.id} className="appt-item">
                    <div className="appt-title">
                      {formatTime(a.startAt)} — {a.patientName}
                    </div>
                    <div className="appt-meta">
                      {a.type} · {a.staff}
                    </div>
                    <div className="appt-badge">
                      <StatusBadge status={a.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <section className="panel">
        <h3>全予約（本日）</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>開始</th>
              <th>終了</th>
              <th>チェア</th>
              <th>患者</th>
              <th>種別</th>
              <th>担当</th>
              <th>メモ</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{formatTime(a.startAt)}</td>
                <td>{formatTime(a.endAt)}</td>
                <td>{a.chair}</td>
                <td>{a.patientName}</td>
                <td>{a.type}</td>
                <td>{a.staff}</td>
                <td>{a.notes || '—'}</td>
                <td>
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
