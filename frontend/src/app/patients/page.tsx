import Link from 'next/link'
import { Pagination } from '@/components/Pagination'
import { PatientsPageDocument, type PatientsPageQuery } from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'
import { parsePageParams } from '@/lib/pagination'

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function PatientsPage({ searchParams }: Props) {
  const params = await searchParams
  const { page, pageSize } = parsePageParams(params)

  let error: string | null = null
  let result: PatientsPageQuery['patients'] = {
    items: [],
    pageInfo: { total: 0, page: 1, pageSize, totalPages: 0 },
  }

  try {
    const data = await gqlRequest(PatientsPageDocument, { page, pageSize })
    result = data.patients
  } catch (e) {
    error = e instanceof Error ? e.message : 'GraphQL error'
  }

  const patients = result.items
  const { pageInfo } = result

  return (
    <>
      <div className="page-head">
        <h2>患者管理</h2>
        <p>
          GraphQL Query <code>patients</code> でカルテ・連絡先を取得します。
        </p>
      </div>
      {error ? <div className="alert">{error}</div> : null}
      <section className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>カルテNo</th>
              <th>氏名</th>
              <th>フリガナ</th>
              <th>電話</th>
              <th>アレルギー</th>
              <th>最終来院</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/patients/${p.id}`} className="table-link">
                    {p.chartNo}
                  </Link>
                </td>
                <td>{p.name}</td>
                <td>{p.kana}</td>
                <td>{p.phone}</td>
                <td>{p.allergies || '—'}</td>
                <td>{p.lastVisit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          basePath="/patients"
          page={pageInfo.page}
          pageSize={pageInfo.pageSize}
          totalPages={pageInfo.totalPages}
          total={pageInfo.total}
        />
      </section>
    </>
  )
}
