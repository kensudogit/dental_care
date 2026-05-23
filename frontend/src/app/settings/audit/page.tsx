import { AuditLogsPageDocument } from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

export const dynamic = 'force-dynamic'

export default async function AuditSettingsPage() {
  const data = await gqlRequest(AuditLogsPageDocument, { limit: 50 })

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
          {data.auditLogs.map((log) => (
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
    </section>
  )
}
