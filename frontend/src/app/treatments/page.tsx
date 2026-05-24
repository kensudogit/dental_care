import Link from 'next/link'
import { Pagination } from '@/components/Pagination'
import { StatusBadge } from '@/components/StatusBadge'
import { TreatmentsPageDocument, type TreatmentsPageQuery } from '@/lib/generated/graphql'
import { formatYen, gqlRequest } from '@/lib/gql'
import { parsePageParams } from '@/lib/pagination'

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function TreatmentsPage({ searchParams }: Props) {
  const params = await searchParams
  const { page, pageSize } = parsePageParams(params)

  let error: string | null = null
  let result: TreatmentsPageQuery['treatments'] = {
    items: [],
    pageInfo: { total: 0, page: 1, pageSize, totalPages: 0 },
  }

  try {
    const data = await gqlRequest(TreatmentsPageDocument, { page, pageSize })
    result = data.treatments
  } catch (e) {
    error = e instanceof Error ? e.message : 'GraphQL error'
  }

  const treatments = result.items
  const { pageInfo } = result
  const total = treatments.reduce((s, t) => s + t.fee, 0)

  return (
    <>
      <div className="page-head">
        <h2>診療記録</h2>
        <p>
          GraphQL Query <code>treatments</code> で処置・診断・料金を取得します。
        </p>
      </div>
      {error ? <div className="alert">{error}</div> : null}

      <section className="stat-grid" style={{ maxWidth: 400 }}>
        <article className="stat-card accent-emerald">
          <p className="stat-label">記録件数（全件）</p>
          <p className="stat-value">{pageInfo.total} 件</p>
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
              <th>口腔レントゲン</th>
              <th>カルテ</th>
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
                <td className="action-cell">
                  <Link
                    href={`/patients/${t.patientId}#xray-form`}
                    className="btn ghost sm"
                    title={`${t.patientName ?? t.patientId} のレントゲンを登録`}
                  >
                    登録
                  </Link>
                  <Link
                    href={`/patients/${t.patientId}#xray-list`}
                    className="btn ghost sm"
                    title={`${t.patientName ?? t.patientId} のレントゲンを修正`}
                  >
                    修正
                  </Link>
                  <Link
                    href={`/patients/${t.patientId}#xray-list`}
                    className="btn ghost sm danger"
                    title={`${t.patientName ?? t.patientId} のレントゲンを削除`}
                  >
                    削除
                  </Link>
                </td>
                <td className="action-cell">
                  <Link
                    href={`/patients/${t.patientId}/karte#karte-form`}
                    className="btn ghost sm"
                    title={`${t.patientName ?? t.patientId} のカルテを登録`}
                  >
                    登録
                  </Link>
                  <Link
                    href={`/patients/${t.patientId}/karte?edit=${t.id}#karte-form`}
                    className="btn ghost sm"
                    title={`${t.patientName ?? t.patientId} のカルテを修正`}
                  >
                    修正
                  </Link>
                  <Link
                    href={`/patients/${t.patientId}/karte#karte-list`}
                    className="btn ghost sm danger"
                    title={`${t.patientName ?? t.patientId} のカルテを削除`}
                  >
                    削除
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          basePath="/treatments"
          page={pageInfo.page}
          pageSize={pageInfo.pageSize}
          totalPages={pageInfo.totalPages}
          total={pageInfo.total}
        />
      </section>
    </>
  )
}
