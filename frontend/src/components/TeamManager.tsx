'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { RoleBadge } from '@/components/RoleBadge'
import {
  InviteTeamMemberDocument,
  RemoveTeamMemberDocument,
  UpdateTeamMemberRoleDocument,
  type TeamMembersQuery,
} from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

type Member = TeamMembersQuery['teamMembers'][number]

const roles = ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'] as const

export function TeamManager({ members: initial }: { members: Member[] }) {
  const router = useRouter()
  const [members, setMembers] = useState(initial)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<(typeof roles)[number]>('MEMBER')
  const [message, setMessage] = useState<string | null>(null)

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    try {
      const result = await gqlRequest(InviteTeamMemberDocument, {
        input: { email, name: name || undefined, role },
      })
      setMembers((prev) => [...prev, result.inviteTeamMember as Member])
      setEmail('')
      setName('')
      setMessage('Member invited.')
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Invite failed')
    }
  }

  async function changeRole(id: string, next: string) {
    try {
      await gqlRequest(UpdateTeamMemberRoleDocument, { input: { id, role: next as (typeof roles)[number] } })
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role: next as Member['role'] } : m)))
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Role update failed')
    }
  }

  async function remove(id: string) {
    try {
      await gqlRequest(RemoveTeamMemberDocument, { id })
      setMembers((prev) => prev.filter((m) => m.id !== id))
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Remove failed')
    }
  }

  return (
    <div className="team-manager">
      <form className="saas-form panel" onSubmit={invite}>
        <h3>Invite member</h3>
        <div className="form-row">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value as (typeof roles)[number])}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="btn-primary">
          Send invite
        </button>
      </form>

      {message ? <p className="form-status">{message}</p> : null}

      <section className="panel">
        <h3>Team ({members.length})</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.user.name}</td>
                <td className="mono">{m.user.email}</td>
                <td>
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value)}
                    className="role-select"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <RoleBadge role={m.role} />
                </td>
                <td className="mono">{new Date(m.lastActiveAt).toLocaleString('ja-JP')}</td>
                <td>
                  {m.role !== 'OWNER' ? (
                    <button type="button" className="btn-ghost" onClick={() => remove(m.id)}>
                      Remove
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
