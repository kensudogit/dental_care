import Link from 'next/link'
import { PatientsPageDocument, type PatientsPageQuery } from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

export const dynamic = 'force-dynamic'

export default async function PatientsPage() {
  let error: string | null = null
  let patients: PatientsPageQuery['patients'] = []

  try {
    const data = await gqlRequest(PatientsPageDocument)
    patients = data.patients
  } catch (e) {
    error = e instanceof Error ? e.message : 'GraphQL エラー'
  }

  return (
    <>
      <div className="page-head">
        <h2>患者管理</h2>
        <p>GraphQL Query <code>patients</code> でカルテ・連絡先を取得します。</p>
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
      </section>
    </>
  )
}
