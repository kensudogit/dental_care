'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  UpdateOrganizationDocument,
  type UpdateOrganizationMutationVariables,
} from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

type Props = {
  initial: {
    name: string
    slug: string
    chairCount: number
    timezone: string
  }
}

export function OrganizationForm({ initial }: Props) {
  const router = useRouter()
  const [name, setName] = useState(initial.name)
  const [slug, setSlug] = useState(initial.slug)
  const [chairCount, setChairCount] = useState(String(initial.chairCount))
  const [timezone, setTimezone] = useState(initial.timezone)
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const input: UpdateOrganizationMutationVariables['input'] = {
        name,
        slug,
        chairCount: parseInt(chairCount, 10) || 1,
        timezone,
      }
      await gqlRequest(UpdateOrganizationDocument, { input })
      setStatus('Saved.')
      router.refresh()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="saas-form panel" onSubmit={onSubmit}>
      <h3>Organization profile</h3>
      <label>
        Clinic name
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Slug
        <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </label>
      <label>
        Chair count
        <input
          type="number"
          min={1}
          max={20}
          value={chairCount}
          onChange={(e) => setChairCount(e.target.value)}
        />
      </label>
      <label>
        Timezone
        <input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
      </label>
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>
        {status ? <span className="form-status">{status}</span> : null}
      </div>
    </form>
  )
}

