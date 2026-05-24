import { toTelHref } from '@/lib/phone'

type Props = {
  phone: string
  className?: string
}

export function PhoneLink({ phone, className = 'phone-link' }: Props) {
  const href = toTelHref(phone)
  if (!href) return <>—</>

  return (
    <a href={href} className={className} title={`${phone} \u306b\u767a\u4fe1`}>
      {phone}
    </a>
  )
}
