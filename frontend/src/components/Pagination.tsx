import Link from 'next/link'

type Props = {
  basePath: string
  page: number
  pageSize: number
  totalPages: number
  total: number
  extraQuery?: Record<string, string>
}

function pageHref(
  basePath: string,
  page: number,
  pageSize: number,
  extraQuery: Record<string, string>,
) {
  const params = new URLSearchParams({
    ...extraQuery,
    page: String(page),
    pageSize: String(pageSize),
  })
  return `${basePath}?${params.toString()}`
}

export function Pagination({
  basePath,
  page,
  pageSize,
  totalPages,
  total,
  extraQuery = {},
}: Props) {
  if (totalPages <= 1 && total <= pageSize) return null

  const prev = page > 1 ? page - 1 : null
  const next = page < totalPages ? page + 1 : null
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <nav className="pagination" aria-label="Pagination">
      <p className="pagination-summary">
        {total === 0
          ? '0 items'
          : `${start}\u2013${end} / ${total}`}
      </p>
      <div className="pagination-controls">
        {prev ? (
          <Link
            href={pageHref(basePath, prev, pageSize, extraQuery)}
            className="pagination-btn"
          >
            Prev
          </Link>
        ) : (
          <span className="pagination-btn disabled">Prev</span>
        )}
        <span className="pagination-current">
          {page} / {totalPages || 1}
        </span>
        {next ? (
          <Link
            href={pageHref(basePath, next, pageSize, extraQuery)}
            className="pagination-btn"
          >
            Next
          </Link>
        ) : (
          <span className="pagination-btn disabled">Next</span>
        )}
      </div>
    </nav>
  )
}
