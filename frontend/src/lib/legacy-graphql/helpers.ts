export function pageInfo(total: number, page: number, pageSize: number) {
  const ps = Math.max(1, pageSize)
  const p = Math.max(1, page)
  return {
    total,
    page: p,
    pageSize: ps,
    totalPages: Math.max(1, Math.ceil(total / ps)),
  }
}

export function paginateArray<T>(items: T[], page?: number, pageSize?: number) {
  const p = Math.max(1, page ?? 1)
  const ps = Math.max(1, pageSize ?? 10)
  const start = (p - 1) * ps
  return {
    items: items.slice(start, start + ps),
    pageInfo: pageInfo(items.length, p, ps),
  }
}

export function toInt(v: unknown, fallback: number): number {
  if (typeof v === 'number' && Number.isFinite(v)) return Math.floor(v)
  return fallback
}
