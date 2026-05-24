'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PerioChartManager } from '@/components/PerioChartManager'
import { StatusBadge } from '@/components/StatusBadge'
import {
  ToothChart,
  emptyToothChart,
  parseToothChartJson,
  serializeToothChart,
  type ToothChartData,
} from '@/components/ToothChart'
import { XrayGallery } from '@/components/XrayGallery'
import {
  CreateTreatmentDocument,
  DeleteTreatmentDocument,
  UpdateTreatmentDocument,
  XrayImageType,
  type PatientKartePageQuery,
} from '@/lib/generated/graphql'
import { formatYen, gqlRequest } from '@/lib/gql'
import { PROCEDURE_PRESETS, findProcedurePreset } from '@/lib/procedurePresets'

type Treatment = PatientKartePageQuery['treatments']['items'][number]
type Xray = PatientKartePageQuery['xrayImages'][number]
type PerioExam = PatientKartePageQuery['perioExams'][number]

type TabId = 'soap' | 'tooth' | 'history' | 'xray' | 'photo' | 'perio'

type FormState = {
  visitDate: string
  tooth: string
  procedureCode: string
  procedure: string
  diagnosis: string
  fee: string
  staff: string
  status: string
  tags: string
  subjective: string
  objective: string
  assessment: string
  plan: string
}

const STATUS_OPTIONS = [
  { value: 'completed', label: '\u5b8c\u4e86' },
  { value: 'in_progress', label: '\u7d99\u7d9a' },
  { value: 'pending', label: '\u4e88\u5b9a' },
]

const TABS: { id: TabId; label: string }[] = [
  { id: 'soap', label: 'SOAP\u30fb\u51e6\u7f6e' },
  { id: 'tooth', label: '\u6b6f\u5f0f' },
  { id: 'history', label: '\u6cbb\u7642\u5c65\u6b74' },
  { id: 'xray', label: '\u30ec\u30f3\u30c8\u30b2\u30f3' },
  { id: 'photo', label: '\u53e3\u8154\u5185\u5199\u771f' },
  { id: 'perio', label: '\u30da\u30ea\u30aa' },
]

const emptyForm = (): FormState => ({
  visitDate: new Date().toISOString().slice(0, 10),
  tooth: '',
  procedureCode: '',
  procedure: '',
  diagnosis: '',
  fee: '',
  staff: '',
  status: 'completed',
  tags: '',
  subjective: '',
  objective: '',
  assessment: '',
  plan: '',
})

function parseTags(raw: string) {
  return raw
    .split(/[,,\uFF0C]/)
    .map((t) => t.trim())
    .filter(Boolean)
}

type Props = {
  patientId: string
  patientName: string
  chartNo: string
  initialTreatments: Treatment[]
  initialXrays: Xray[]
  initialPerioExams: PerioExam[]
  editId?: string
}

export function ElectronicKarteManager({
  patientId,
  patientName,
  chartNo,
  initialTreatments,
  initialXrays,
  initialPerioExams,
  editId,
}: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<TabId>('soap')
  const [items, setItems] = useState(initialTreatments)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Treatment | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [toothChart, setToothChart] = useState<ToothChartData>(emptyToothChart())

  const xrayItems = useMemo(
    () => initialXrays.filter((x) => x.imageType !== XrayImageType.Intraoral),
    [initialXrays],
  )
  const photoItems = useMemo(
    () => initialXrays.filter((x) => x.imageType === XrayImageType.Intraoral),
    [initialXrays],
  )

  const resetForm = useCallback(() => {
    setEditing(null)
    setForm(emptyForm())
    setToothChart(emptyToothChart())
  }, [])

  const startEdit = useCallback((t: Treatment) => {
    setEditing(t)
    setForm({
      visitDate: t.visitDate,
      tooth: t.tooth,
      procedureCode: t.procedureCode ?? '',
      procedure: t.procedure,
      diagnosis: t.diagnosis,
      fee: String(t.fee),
      staff: t.staff,
      status: t.status,
      tags: t.tags?.join(', ') ?? '',
      subjective: t.subjective ?? '',
      objective: t.objective ?? '',
      assessment: t.assessment ?? '',
      plan: t.plan ?? '',
    })
    setToothChart(parseToothChartJson(t.toothChartJson))
    setTab('soap')
    document.getElementById('karte-form')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!editId) return
    const target = items.find((t) => t.id === editId)
    if (target) startEdit(target)
  }, [editId, items, startEdit])

  useEffect(() => {
    if (toothChart.selected.length === 0) return
    setForm((f) => ({
      ...f,
      tooth: toothChart.selected.length === 1 ? toothChart.selected[0] : toothChart.selected.join(', '),
    }))
  }, [toothChart.selected])

  function onProcedureCodeChange(code: string) {
    const preset = findProcedurePreset(code)
    setForm((f) => ({
      ...f,
      procedureCode: code,
      procedure: preset?.label ?? f.procedure,
      fee: preset?.defaultFee != null ? String(preset.defaultFee) : f.fee,
    }))
  }

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
      const payload = {
        visitDate: form.visitDate,
        tooth: form.tooth,
        procedureCode: form.procedureCode,
        procedure: form.procedure,
        diagnosis: form.diagnosis,
        fee,
        staff: form.staff,
        status: form.status,
        tags,
        subjective: form.subjective,
        objective: form.objective,
        assessment: form.assessment,
        plan: form.plan,
        toothChartJson: serializeToothChart(toothChart),
      }

      if (editing) {
        const data = await gqlRequest(UpdateTreatmentDocument, {
          input: { id: editing.id, ...payload },
        })
        const updated = data.updateTreatment
        setItems((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        setMessage('\u30ab\u30eb\u30c6\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f')
      } else {
        const data = await gqlRequest(CreateTreatmentDocument, {
          input: { patientId, ...payload },
        })
        setItems((prev) => [data.createTreatment, ...prev])
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
          <Link href={`/patients/${patientId}`} className="back-link">
            &larr; {'\u60a3\u8005\u8a73\u7d30'}
          </Link>
          {' / '}
          <Link href="/treatments" className="back-link">
            {'\u8a3a\u7642\u8a18\u9332\u4e00\u89a7'}
          </Link>
        </p>
        <h2>
          {patientName} {'\u306e\u96fb\u5b50\u30ab\u30eb\u30c6'}
        </h2>
        <p>
          {'\u30ab\u30eb\u30c6No'} {chartNo} {'\u2014 SOAP\u30fb\u6b6f\u5f0f\u30fb\u6cbb\u7642\u5c65\u6b74\u30fb\u30ec\u30f3\u30c8\u30b2\u30f3\u30fb\u53e3\u8154\u5185\u5199\u771f\u30fb\u30da\u30ea\u30aa'}
        </p>
      </div>

      <nav className="karte-tabs" aria-label="karte sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`karte-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {message ? <div className="alert">{message}</div> : null}

      {tab === 'soap' ? (
        <section id="karte" className="panel karte-panel">
          <form id="karte-form" className="saas-form karte-form" onSubmit={onSubmit}>
            <h3>{editing ? '\u30ab\u30eb\u30c6\u3092\u66f4\u65b0' : '\u30ab\u30eb\u30c6\u3092\u767b\u9332'}</h3>

            <div className="soap-grid">
              <label>
                S {'\uff08\u4e3b\u89b3\u7684\u6240\u8981\uff09'}
                <textarea
                  rows={3}
                  value={form.subjective}
                  onChange={(e) => setForm({ ...form, subjective: e.target.value })}
                  placeholder="\u4e3b\u8a34\u3001\u75c7\u72b6\u306a\u3069"
                />
              </label>
              <label>
                O {'\uff08\u5ba2\u89b3\u7684\u6240\u8981\uff09'}
                <textarea
                  rows={3}
                  value={form.objective}
                  onChange={(e) => setForm({ ...form, objective: e.target.value })}
                  placeholder="\u6240\u898b\u3001\u691c\u67fb\u7d50\u679c\u306a\u3069"
                />
              </label>
              <label>
                A {'\uff08\u8a55\u4fa1\uff09'}
                <textarea
                  rows={2}
                  value={form.assessment}
                  onChange={(e) => setForm({ ...form, assessment: e.target.value })}
                />
              </label>
              <label>
                P {'\uff08\u30d7\u30e9\u30f3\uff09'}
                <textarea
                  rows={2}
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value })}
                />
              </label>
            </div>

            <ToothChart value={toothChart} onChange={setToothChart} compact />

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
                {'\u51e6\u7f6e\u30b3\u30fc\u30c9'}
                <select
                  value={form.procedureCode}
                  onChange={(e) => onProcedureCodeChange(e.target.value)}
                >
                  <option value="">{'\u624b\u5165\u529b'}</option>
                  {PROCEDURE_PRESETS.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} {p.label}
                    </option>
                  ))}
                </select>
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
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
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
      ) : null}

      {tab === 'tooth' ? (
        <section className="panel karte-panel">
          <h3>{'\u6b6f\u5f0f\u30c1\u30e3\u30fc\u30c8'}</h3>
          <p className="muted">{'\u6b6f\u3092\u9078\u629e\u3057\u3066\u72b6\u614b\u3092\u8a18\u9332\u3057\u307e\u3059\u3002SOAP\u30fb\u51e6\u7f6e\u30bf\u30d6\u3067\u4fdd\u5b58\u3057\u3066\u304f\u3060\u3055\u3044\u3002'}</p>
          <ToothChart value={toothChart} onChange={setToothChart} />
          <div className="form-actions">
            <button type="button" className="btn primary" onClick={() => setTab('soap')}>
              {'SOAP\u30fb\u51e6\u7f6e\u3067\u4fdd\u5b58\u3078'}
            </button>
          </div>
        </section>
      ) : null}

      {tab === 'history' ? (
        <section className="panel">
          <h3 id="karte-list">
            {'\u6cbb\u7642\u5c65\u6b74'} ({items.length})
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
                  <th>{'SOAP'}</th>
                  <th>{'\u6599\u91d1'}</th>
                  <th>{'\u72b6\u614b'}</th>
                  <th>{'\u64cd\u4f5c'}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.id}>
                    <td>{t.visitDate}</td>
                    <td>{t.tooth}</td>
                    <td>
                      {t.procedureCode ? `[${t.procedureCode}] ` : ''}
                      {t.procedure}
                    </td>
                    <td>{t.diagnosis}</td>
                    <td className="soap-summary">
                      {t.subjective ? `S: ${t.subjective.slice(0, 30)}${t.subjective.length > 30 ? '\u2026' : ''}` : '\u2014'}
                    </td>
                    <td>{formatYen(t.fee)}</td>
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
      ) : null}

      {tab === 'xray' ? (
        <XrayGallery
          patientId={patientId}
          initial={xrayItems}
          mode="xray"
          panelTitle={'\u53e3\u8154\u30ec\u30f3\u30c8\u30b2\u30f3'}
        />
      ) : null}

      {tab === 'photo' ? (
        <XrayGallery
          patientId={patientId}
          initial={photoItems}
          mode="intraoral"
          panelTitle={'\u53e3\u8154\u5185\u5199\u771f'}
        />
      ) : null}

      {tab === 'perio' ? (
        <PerioChartManager patientId={patientId} initial={initialPerioExams} />
      ) : null}
    </>
  )
}
