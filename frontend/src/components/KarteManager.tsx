'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { StatusBadge } from '@/components/StatusBadge'
import {
  CreateTreatmentDocument,
  DeleteTreatmentDocument,
  UpdateTreatmentDocument,
  type PatientKartePageQuery,
} from '@/lib/generated/graphql'
import { formatYen, gqlRequest } from '@/lib/gql'

type Treatment = PatientKartePageQuery['treatments']['items'][number]

type FormState = {
  visitDate: string
  tooth: string
  procedure: string
  diagnosis: string
  fee: string
  staff: string
  status: string
  tags: string
}

const STATUS_OPTIONS = [
  { value: 'completed', label: '\u5b8c\u4e86' },
  { value: 'in_progress', label: '\u7d99\u7d9a' },
  { value: 'pending', label: '\u4e88\u5b9a' },
]

const emptyForm = (): FormState => ({
  visitDate: new Date().toISOString().slice(0, 10),
  tooth: '',
  procedure: '',
  diagnosis: '',
  fee: '',
  staff: '',
  status: 'completed',
  tags: '',
})

function parseTags(raw: string) {
  return raw
    .split(/[,?]/)
    .map((t) => t.trim())
    .filter(Boolean)
}

type Props = {
  patientId: string
  patientName: string
  chartNo: string
  initial: Treatment[]
  editId?: string
}

export function KarteManager({ patientId, patientName, chartNo, initial, editId }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Treatment | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())

  const resetForm = useCallback(() => {
    setEditing(null)
    setForm(emptyForm())
  }, [])

  const startEdit = useCallback((t: Treatment) => {
    setEditing(t)
    setForm({
      visitDate: t.visitDate,
      tooth: t.tooth,
      procedure: t.procedure,
      diagnosis: t.diagnosis,
      fee: String(t.fee),
      staff: t.staff,
      status: t.status,
      tags: t.tags?.join(', ') ?? '',
    })
    document.getElementById('karte-form')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!editId) return
    const target = items.find((t) => t.id === editId)
    if (target) startEdit(target)
  }, [editId, items, startEdit])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const tags = parseTags(form.tags)
      const fee = Number(form.fee)
      if (!Number.isFinite(fee) || fee < 0) {
        throw new Error('\u6599\u91d1\u3092\u6b63\u3057\u304f\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044')
      }

      if (editing) {
        const data = await gqlRequest(UpdateTreatmentDocument, {
          input: {
            id: editing.id,
            visitDate: form.visitDate,
            tooth: form.tooth,
            procedure: form.procedure,
            diagnosis: form.diagnosis,
            fee,
            staff: form.staff,
            status: form.status,
            tags,
          },
        })
        const updated = data.updateTreatment
        setItems((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        setMessage('\u30ab\u30eb\u30c6\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f')
      } else {
        const data = await gqlRequest(CreateTreatmentDocument, {
          input: {
            patientId,
            visitDate: form.visitDate,
            tooth: form.tooth,
            procedure: form.procedure,
            diagnosis: form.diagnosis,
            fee,
            staff: form.staff,
            status: form.status,
            tags,
          },
        })
        const created = data.createTreatment
        setItems((prev) => [created, ...prev])
        setMessage('\u30ab\u30eb\u30c6\u3092\u767b\u9332\u3057\u307e\u3057\u305f')
      }
      resetForm()
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(t: Treatment) {
    const label = `${t.procedure} (${t.visitDate})`
    if (!window.confirm(`\u300c${label}\u300d\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f`)) return
    setLoading(true)
    setMessage(null)
    try {
      await gqlRequest(DeleteTreatmentDocument, { id: t.id })
      setItems((prev) => prev.filter((x) => x.id !== t.id))
      if (editing?.id === t.id) resetForm()
      setMessage('\u30ab\u30eb\u30c6\u3092\u524a\u9664\u3057\u307e\u3057\u305f')
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-head">
        <p className="page-head-back">
          <Link href="/treatments" className="back-link">
            &larr; {'\u8a3a\u7642\u8a18\u9332\u4e00\u89a7'}
          </Link>
        </p>
        <h2>
          {patientName} {'\u306e\u30ab\u30eb\u30c6'}
        </h2>
        <p>
          {'\u30ab\u30eb\u30c6No'} {chartNo} {'\u2014 \u767b\u9332\u30fb\u66f4\u65b0\u30fb\u524a\u9664'}
        </p>
      </div>

      <section id="karte" className="panel karte-panel">
        <form id="karte-form" className="saas-form karte-form" onSubmit={onSubmit}>
          <h3>{editing ? '\u30ab\u30eb\u30c6\u3092\u66f4\u65b0' : '\u30ab\u30eb\u30c6\u3092\u767b\u9332'}</h3>
          <div className="form-row">
            <label>
              {'\u6765\u9662\u65e5'}
              <input
                type="date"
                value={form.visitDate}
                onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                required
              />
            </label>
            <label>
              {'\u90e8\u4f4d'}
              <input
                value={form.tooth}
                onChange={(e) => setForm({ ...form, tooth: e.target.value })}
                placeholder="16 / \u5168\u4f53"
                required
              />
            </label>
            <label>
              {'\u51e6\u7f6e'}
              <input
                value={form.procedure}
                onChange={(e) => setForm({ ...form, procedure: e.target.value })}
                required
              />
            </label>
            <label>
              {'\u8a3a\u65ad'}
              <input
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                required
              />
            </label>
            <label>
              {'\u6599\u91d1 (\u5186)'}
              <input
                type="number"
                min={0}
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: e.target.value })}
                required
              />
            </label>
            <label>
              {'\u62c5\u5f53'}
              <input
                value={form.staff}
                onChange={(e) => setForm({ ...form, staff: e.target.value })}
                required
              />
            </label>
            <label>
              {'\u72b6\u614b'}
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {'\u30bf\u30b0'}
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder={'\u4e88\u9632, \u4fdd\u5b58'}
              />
            </label>
          </div>
          <div className="form-actions">
            {editing ? (
              <button type="button" className="btn ghost" onClick={resetForm} disabled={loading}>
                {'\u65b0\u898f\u767b\u9332\u306b\u5207\u66ff'}
              </button>
            ) : null}
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? '\u4fdd\u5b58\u4e2d...' : editing ? '\u66f4\u65b0' : '\u767b\u9332'}
            </button>
          </div>
        </form>
      </section>

      {message ? <div className="alert">{message}</div> : null}

      <section className="panel">
        <h3 id="karte-list">
          {'\u30ab\u30eb\u30c6\u4e00\u89a7'} ({items.length})
        </h3>
        {items.length === 0 ? (
          <p className="panel-empty">{'\u30ab\u30eb\u30c6\u304c\u3042\u308a\u307e\u305b\u3093'}</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>{'\u6765\u9662\u65e5'}</th>
                <th>{'\u90e8\u4f4d'}</th>
                <th>{'\u51e6\u7f6e'}</th>
                <th>{'\u8a3a\u65ad'}</th>
                <th>{'\u6599\u91d1'}</th>
                <th>{'\u62c5\u5f53'}</th>
                <th>{'\u30bf\u30b0'}</th>
                <th>{'\u72b6\u614b'}</th>
                <th>{'\u64cd\u4f5c'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>{t.visitDate}</td>
                  <td>{t.tooth}</td>
                  <td>{t.procedure}</td>
                  <td>{t.diagnosis}</td>
                  <td>{formatYen(t.fee)}</td>
                  <td>{t.staff}</td>
                  <td>{t.tags?.join(', ') ?? '\u2014'}</td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="action-cell">
                    <div className="action-links">
                      <button
                        type="button"
                        className="btn ghost sm"
                        disabled={loading}
                        onClick={() => startEdit(t)}
                      >
                        {'\u4fee\u6b63'}
                      </button>
                      <button
                        type="button"
                        className="btn ghost sm danger"
                        disabled={loading}
                        onClick={() => onDelete(t)}
                      >
                        {'\u524a\u9664'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  )
}
