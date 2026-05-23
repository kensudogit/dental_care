import { Pagination } from '@/components/Pagination'
import { AuditLogsPageDocument } from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'
import { parsePageParams } from '@/lib/pagination'

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function AuditSettingsPage({ searchParams }: Props) {
  const params = await searchParams
  const { page, pageSize } = parsePageParams(params, 20)
  const data = await gqlRequest(AuditLogsPageDocument, { page, pageSize })
  const logs = data.auditLogs.items
  const { pageInfo } = data.auditLogs

  return (
    <section className="panel">
      <h3>Audit log</h3>
      <p className="muted">Compliance trail for org, team, billing, and API key actions.</p>
      <table className="data-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Action</th>
            <th>Resource</th>
            <th>Actor</th>
            <th>IP</th>
            <th>Metadata</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="mono">{new Date(log.createdAt).toLocaleString('ja-JP')}</td>
              <td>{log.action}</td>
              <td>{log.resource}</td>
              <td>{log.actorName}</td>
              <td className="mono">{log.ipAddress}</td>
              <td className="mono metadata-cell">{log.metadata}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        basePath="/settings/audit"
        page={pageInfo.page}
        pageSize={pageInfo.pageSize}
        totalPages={pageInfo.totalPages}
        total={pageInfo.total}
      />
    </section>
  )
}
