import { notFound } from 'next/navigation'
import { KarteManager } from '@/components/KarteManager'
import { PatientKartePageDocument } from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function pickEditId(params: Record<string, string | string[] | undefined>) {
  const raw = params.edit
  const val = Array.isArray(raw) ? raw[0] : raw
  return val?.trim() || undefined
}

export default async function PatientKartePage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams
  const editId = pickEditId(sp)

  try {
    const data = await gqlRequest(PatientKartePageDocument, { patientId: id, page: 1, pageSize: 100 })
    const patient = data.patient
    if (!patient) notFound()

    return (
      <KarteManager
        patientId={id}
        patientName={patient.name}
        chartNo={patient.chartNo}
        initial={data.treatments.items}
        editId={editId}
      />
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : 'GraphQL error'
    return <div className="alert">{message}</div>
  }
}
