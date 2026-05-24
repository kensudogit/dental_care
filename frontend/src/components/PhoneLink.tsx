import { toTelHref } from '@/lib/phone'

type Props = {
  phone: string
  className?: string
}

const EM_DASH = '\u2014'
const DIAL_TITLE_SUFFIX = '\u306b\u767a\u4fe1'

export function PhoneLink({ phone, className = 'phone-link' }: Props) {
  const href = toTelHref(phone)
  if (!href) return <>{EM_DASH}</>

  return (
    <a href={href} className={className} title={`${phone} ${DIAL_TITLE_SUFFIX}`}>
      {phone}
    </a>
  )
}
