import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StatusBadge } from '@/components/StatusBadge'
import { PatientDetailDocument } from '@/lib/generated/graphql'
import { formatYen, gqlRequest } from '@/lib/gql'

type Props = { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic'

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params

  try {
    const data = await gqlRequest(PatientDetailDocument, { id })
    const patient = data.patient
    if (!patient) notFound()

    const treatments = data.treatments

    return (
      <>
        <div className="page-head">
          <p className="page-head-back">
            <Link href="/patients" className="back-link">
              ← 患者一覧
            </Link>
          </p>
          <h2>{patient.name}</h2>
          <p>
            カルテ {patient.chartNo} · {patient.kana}
          </p>
        </div>

        <section className="panel">
          <h3>基本情報</h3>
          <dl className="info-grid">
            <dt>生年月日</dt>
            <dd>{patient.birthDate}</dd>
            <dt>電話</dt>
            <dd>{patient.phone}</dd>
            <dt>メール</dt>
            <dd>{patient.email || '—'}</dd>
            <dt>アレルギー</dt>
            <dd>{patient.allergies || 'なし'}</dd>
            <dt>備考</dt>
            <dd>{patient.notes || '—'}</dd>
          </dl>
        </section>

        <section className="panel">
          <h3>診療履歴</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>日付</th>
                <th>部位</th>
                <th>処置</th>
                <th>診断</th>
                <th>料金</th>
                <th>状態</th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((t) => (
                <tr key={t.id}>
                  <td>{t.visitDate}</td>
                  <td>{t.tooth}</td>
                  <td>{t.procedure}</td>
                  <td>{t.diagnosis}</td>
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
  } catch {
    notFound()
  }
}
