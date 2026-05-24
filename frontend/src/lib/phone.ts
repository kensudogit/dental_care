/** Strip formatting and build a tel: URI for click-to-dial. */
export function toTelHref(phone: string): string | null {
  const trimmed = phone.trim()
  if (!trimmed) return null

  const normalized = trimmed.replace(/[^\d+]/g, '')
  if (!normalized || normalized === '+') return null

  return `tel:${normalized}`
}
