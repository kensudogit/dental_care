import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { DashboardPageDocument, type DashboardPageQuery } from '@/lib/generated/graphql'
import { formatTime, formatYen, gqlRequest } from '@/lib/gql'
import { graphQLConnectionHint } from '@/lib/resolve-api-url'

export const dynamic = 'force-dynamic'

const emptyData: DashboardPageQuery = {
  dashboard: {
    patientsTotal: 0,
    appointmentsToday: 0,
    treatmentsThisMonth: 0,
    revenueThisMonth: 0,
    chairUtilization: 0,
    noShowRate: 0,
  },
  appointments: { items: [] },
  treatments: { items: [] },
}

export default async function DashboardPage() {
  let error: string | null = null
  let data: DashboardPageQuery = emptyData

  try {
    data = await gqlRequest(DashboardPageDocument)
  } catch (e) {
    error = e instanceof Error ? e.message : 'GraphQL に接続できません'
    data = emptyData
  }

  const stats = data.dashboard
  const appointments = data.appointments.items
  const treatments = data.treatments.items

  const chairs = [1, 2, 3]
  const chairMap = Object.fromEntries(
    chairs.map((c) => [c, appointments.find((a) => a.chair === c)]),
  )

  return (
    <>
      <div className="page-head">
        <h2>ダッシュボード</h2>
        <p>GraphQL 経由で本日の予約・診療状況とクリニックKPIを表示します。</p>
      </div>

      {error ? (
        <div className="alert">
          <p>{error}</p>
          <p className="alert-hint">{graphQLConnectionHint()}</p>
        </div>
      ) : null}

      <section className="stat-grid">
        <StatCard label="登録患者" value={`${stats.patientsTotal} 名`} accent="cyan" />
        <StatCard
          label="本日の予約"
          value={`${stats.appointmentsToday} 件`}
          sub="チェア稼働を下記で確認"
          accent="violet"
        />
        <StatCard
          label="今月売上（デモ）"
          value={formatYen(stats.revenueThisMonth)}
          accent="emerald"
        />
        <StatCard
          label="チェア稼働率"
          value={`${Math.round(stats.chairUtilization * 100)}%`}
          sub={`ノーショー ${Math.round(stats.noShowRate * 100)}%`}
          accent="amber"
        />
      </section>

      <div className="split">
        <section className="panel">
          <h3>診療台（本日）</h3>
          <div className="chair-grid">
            {chairs.map((c) => {
              const a = chairMap[c]
              return (
                <div key={c} className={`chair-card${a ? ' busy' : ''}`}>
                  <div className="chair-label">チェア {c}</div>
                  {a ? (
                    <>
                      <div className="chair-patient">{a.patientName ?? a.patientId}</div>
                      <div className="chair-meta">
                        {formatTime(a.startAt)} — {a.type}
                      </div>
                      <div className="chair-status">
                        <StatusBadge status={a.status} />
                      </div>
                    </>
                  ) : (
                    <span className="chair-empty">空き</span>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="panel">
          <h3>本日の予約一覧</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>時間</th>
                <th>患者</th>
                <th>内容</th>
                <th>担当</th>
                <th>状態</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{formatTime(a.startAt)}</td>
                  <td>{a.patientName ?? a.patientId}</td>
                  <td>{a.type}</td>
                  <td>{a.staff}</td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <section className="panel">
        <h3>直近の診療記録</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>日付</th>
              <th>患者</th>
              <th>部位</th>
              <th>処置</th>
              <th>料金</th>
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
                <td>{formatYen(t.fee)}</td>
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

