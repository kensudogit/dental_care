export const DEFAULT_PAGE_SIZE = 10

export type PageSearchParams = {
  page?: string
  pageSize?: string
  [key: string]: string | string[] | undefined
}

export function parsePageParams(
  searchParams: PageSearchParams | undefined,
  defaultPageSize = DEFAULT_PAGE_SIZE,
) {
  const rawPage = searchParams?.page
  const rawSize = searchParams?.pageSize
  const pageStr = Array.isArray(rawPage) ? rawPage[0] : rawPage
  const sizeStr = Array.isArray(rawSize) ? rawSize[0] : rawSize

  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)
  const pageSize = Math.max(
    1,
    Math.min(100, parseInt(sizeStr ?? String(defaultPageSize), 10) || defaultPageSize),
  )
  return { page, pageSize }
}

export function pickExtraQuery(
  searchParams: PageSearchParams | undefined,
  keys: string[],
): Record<string, string> {
  const out: Record<string, string> = {}
  if (!searchParams) return out
  for (const key of keys) {
    const raw = searchParams[key]
    const val = Array.isArray(raw) ? raw[0] : raw
    if (val) out[key] = val
  }
  return out
}
