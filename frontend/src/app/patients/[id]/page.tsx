import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PatientClinicalTabs } from '@/components/PatientClinicalTabs'
import { StatusBadge } from '@/components/StatusBadge'
import { XrayGallery } from '@/components/XrayGallery'
import {
  PatientClinicalProfileDocument,
  PatientDetailDocument,
  PatientXraysDocument,
} from '@/lib/generated/graphql'
import { formatYen, gqlRequest } from '@/lib/gql'

type Props = { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic'

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params

  try {
    const [data, clinical, xrayData] = await Promise.all([
      gqlRequest(PatientDetailDocument, { id }),
      gqlRequest(PatientClinicalProfileDocument, { id }),
      gqlRequest(PatientXraysDocument, { patientId: id }),
    ])
    const patient = data.patient
    if (!patient) notFound()

    const profile = clinical.patientProfile
    const treatments = data.treatments.items

    return (
      <>
        <div className="page-head">
          <p className="page-head-back">
            <Link href="/patients" className="back-link">
              &larr; \u60a3\u8005\u4e00\u89a7
            </Link>
          </p>
          <h2>{patient.name}</h2>
          <p>
            \u30ab\u30eb\u30c6 {patient.chartNo} \u00b7 {patient.kana}
          </p>
        </div>

        {profile ? <PatientClinicalTabs initial={profile} /> : null}

        <XrayGallery patientId={id} initial={xrayData.xrayImages} />

        <section className="panel">
          <h3>\u8a3a\u7642\u5c65\u6b74</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>\u65e5\u4ed8</th>
                <th>\u90e8\u4f4d</th>
                <th>\u51e6\u7f6e</th>
                <th>\u8a3a\u65ad</th>
                <th>\u6599\u91d1</th>
                <th>\u72b6\u614b</th>
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
