import Link from 'next/link'

const L = {
  register: '\u767b\u9332',
  edit: '\u4fee\u6b63',
  delete: '\u524a\u9664',
  xrayRegisterTitle: (name: string) => `${name} \u306e\u30ec\u30f3\u30c8\u30b2\u30f3\u3092\u767b\u9332`,
  xrayEditTitle: (name: string) => `${name} \u306e\u30ec\u30f3\u30c8\u30b2\u30f3\u3092\u4fee\u6b63`,
  xrayDeleteTitle: (name: string) => `${name} \u306e\u30ec\u30f3\u30c8\u30b2\u30f3\u3092\u524a\u9664`,
  karteRegisterTitle: (name: string) => `${name} \u306e\u30ab\u30eb\u30c6\u3092\u767b\u9332`,
  karteEditTitle: (name: string) => `${name} \u306e\u30ab\u30eb\u30c6\u3092\u4fee\u6b63`,
  karteDeleteTitle: (name: string) => `${name} \u306e\u30ab\u30eb\u30c6\u3092\u524a\u9664`,
} as const

type Props = {
  patientId: string
  patientLabel: string
  treatmentId: string
}

export function XrayActionLinks({ patientId, patientLabel }: Omit<Props, 'treatmentId'>) {
  return (
    <div className="action-links">
      <Link
        href={`/patients/${patientId}#xray-form`}
        className="btn-ghost sm"
        title={L.xrayRegisterTitle(patientLabel)}
      >
        {L.register}
      </Link>
      <Link
        href={`/patients/${patientId}#xray-list`}
        className="btn-ghost sm"
        title={L.xrayEditTitle(patientLabel)}
      >
        {L.edit}
      </Link>
      <Link
        href={`/patients/${patientId}#xray-list`}
        className="btn-ghost sm danger"
        title={L.xrayDeleteTitle(patientLabel)}
      >
        {L.delete}
      </Link>
    </div>
  )
}

export function KarteActionLinks({ patientId, patientLabel, treatmentId }: Props) {
  return (
    <div className="action-links">
      <Link
        href={`/patients/${patientId}/karte#karte-form`}
        className="btn-ghost sm"
        title={L.karteRegisterTitle(patientLabel)}
      >
        {L.register}
      </Link>
      <Link
        href={`/patients/${patientId}/karte?edit=${treatmentId}#karte-form`}
        className="btn-ghost sm"
        title={L.karteEditTitle(patientLabel)}
      >
        {L.edit}
      </Link>
      <Link
        href={`/patients/${patientId}/karte#karte-list`}
        className="btn-ghost sm danger"
        title={L.karteDeleteTitle(patientLabel)}
      >
        {L.delete}
      </Link>
    </div>
  )
}
