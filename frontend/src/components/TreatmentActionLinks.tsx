import Link from 'next/link'

type Props = {
  patientId: string
  patientLabel: string
  treatmentId: string
}

export function XrayActionLinks({ patientId, patientLabel }: Omit<Props, 'treatmentId'>) {
  return (
    <>
      <Link
        href={`/patients/${patientId}#xray-form`}
        className="btn-ghost sm"
        title={`${patientLabel} ?????????`}
      >
        ??
      </Link>
      <Link
        href={`/patients/${patientId}#xray-list`}
        className="btn-ghost sm"
        title={`${patientLabel} ?????????`}
      >
        ??
      </Link>
      <Link
        href={`/patients/${patientId}#xray-list`}
        className="btn-ghost sm danger"
        title={`${patientLabel} ?????????`}
      >
        ??
      </Link>
    </>
  )
}

export function KarteActionLinks({ patientId, patientLabel, treatmentId }: Props) {
  return (
    <>
      <Link
        href={`/patients/${patientId}/karte#karte-form`}
        className="btn-ghost sm"
        title={`${patientLabel} ???????`}
      >
        ??
      </Link>
      <Link
        href={`/patients/${patientId}/karte?edit=${treatmentId}#karte-form`}
        className="btn-ghost sm"
        title={`${patientLabel} ???????`}
      >
        ??
      </Link>
      <Link
        href={`/patients/${patientId}/karte#karte-list`}
        className="btn-ghost sm danger"
        title={`${patientLabel} ???????`}
      >
        ??
      </Link>
    </>
  )
}
