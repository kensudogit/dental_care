'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  CreateApiKeyDocument,
  RevokeApiKeyDocument,
  type ApiKeysPageQuery,
} from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

type Key = ApiKeysPageQuery['apiKeys'][number]

export function ApiKeyManager({ keys: initial }: { keys: Key[] }) {
  const router = useRouter()
  const [keys, setKeys] = useState(initial)
  const [name, setName] = useState('')
  const [secret, setSecret] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function createKey(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setSecret(null)
    try {
      const result = await gqlRequest(CreateApiKeyDocument, { input: { name } })
      setSecret(result.createApiKey.secret)
      setKeys((prev) => [result.createApiKey.apiKey as Key, ...prev])
      setName('')
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Create failed')
    }
  }

  async function revoke(id: string) {
    try {
      await gqlRequest(RevokeApiKeyDocument, { id })
      setKeys((prev) => prev.filter((k) => k.id !== id))
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Revoke failed')
    }
  }

  return (
    <div className="api-key-manager">
      <form className="saas-form panel" onSubmit={createKey}>
        <h3>Create API key</h3>
        <p className="muted">Use keys for B2B integrations.</p>
        <label>
          Key name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <button type="submit" className="btn-primary">
          Generate key
        </button>
      </form>

      {secret ? (
        <div className="alert alert-success">
          <strong>Copy this secret now. It will not be shown again:</strong>
          <code className="secret-block">{secret}</code>
        </div>
      ) : null}
      {message ? <p className="form-status">{message}</p> : null}

      <section className="panel">
        <h3>Active keys ({keys.length})</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Prefix</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id}>
                <td>{k.name}</td>
                <td className="mono">{k.prefix}****</td>
                <td className="mono">{new Date(k.createdAt).toLocaleString('ja-JP')}</td>
                <td>
                  <button type="button" className="btn-ghost" onClick={() => revoke(k.id)}>
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
