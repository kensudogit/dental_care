export type PageInfo = {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function normalizePage(page?: number, pageSize?: number) {
  const p = Math.max(1, page ?? 1)
  const ps = Math.max(1, Math.min(100, pageSize ?? 10))
  return { page: p, pageSize: ps }
}

export function slicePage<T>(items: T[], page?: number, pageSize?: number) {
  const { page: p, pageSize: ps } = normalizePage(page, pageSize)
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / ps) || 1)
  const start = (p - 1) * ps
  return {
    items: items.slice(start, start + ps),
    pageInfo: { total, page: p, pageSize: ps, totalPages },
  }
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function isoNow() {
  return new Date().toISOString()
}
