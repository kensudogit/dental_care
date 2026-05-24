'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { FDI_TEETH } from '@/components/ToothChart'
import {
  CreatePerioExamDocument,
  DeletePerioExamDocument,
  UpdatePerioExamDocument,
  type PatientKartePageQuery,
} from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

type PerioExam = PatientKartePageQuery['perioExams'][number]
type PerioSite = PerioExam['sites'][number]

type SiteForm = {
  tooth: string
  pdMesial: string
  pdBuccal: string
  pdDistal: string
  pdLingual: string
  bop: boolean
  mobility: string
}

type FormState = {
  examDate: string
  staff: string
  notes: string
  sites: SiteForm[]
}

const emptySite = (tooth: string): SiteForm => ({
  tooth,
  pdMesial: '0',
  pdBuccal: '0',
  pdDistal: '0',
  pdLingual: '0',
  bop: false,
  mobility: '0',
})

const emptyForm = (): FormState => ({
  examDate: new Date().toISOString().slice(0, 10),
  staff: '',
  notes: '',
  sites: [],
})

function siteToForm(s: PerioSite): SiteForm {
  return {
    tooth: s.tooth,
    pdMesial: String(s.pdMesial),
    pdBuccal: String(s.pdBuccal),
    pdDistal: String(s.pdDistal),
    pdLingual: String(s.pdLingual),
    bop: s.bop,
    mobility: String(s.mobility),
  }
}

function formSiteToInput(s: SiteForm) {
  return {
    tooth: s.tooth,
    pdMesial: Number(s.pdMesial) || 0,
    pdBuccal: Number(s.pdBuccal) || 0,
    pdDistal: Number(s.pdDistal) || 0,
    pdLingual: Number(s.pdLingual) || 0,
    bop: s.bop,
    mobility: Number(s.mobility) || 0,
  }
}

type Props = {
  patientId: string
  initial: PerioExam[]
}

export function PerioChartManager({ patientId, initial }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [editing, setEditing] = useState<PerioExam | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [selectedTeeth, setSelectedTeeth] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const resetForm = useCallback(() => {
    setEditing(null)
    setForm(emptyForm())
    setSelectedTeeth([])
  }, [])

  const startEdit = useCallback((exam: PerioExam) => {
    setEditing(exam)
    setForm({
      examDate: exam.examDate,
      staff: exam.staff,
      notes: exam.notes,
      sites: exam.sites.map(siteToForm),
    })
    setSelectedTeeth(exam.sites.map((s) => s.tooth))
  }, [])

  function toggleTooth(tooth: string) {
    setSelectedTeeth((prev) => {
      const next = prev.includes(tooth) ? prev.filter((t) => t !== tooth) : [...prev, tooth]
      setForm((f) => {
        const existing = new Map(f.sites.map((s) => [s.tooth, s]))
        const sites = next.map((t) => existing.get(t) ?? emptySite(t))
        return { ...f, sites }
      })
      return next
    })
  }

  function updateSite(tooth: string, patch: Partial<SiteForm>) {
    setForm((f) => ({
      ...f,
      sites: f.sites.map((s) => (s.tooth === tooth ? { ...s, ...patch } : s)),
    }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.sites.length === 0) {
      setMessage('\u691c\u67fb\u7259\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044')
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const sites = form.sites.map(formSiteToInput)
      if (editing) {
        const data = await gqlRequest(UpdatePerioExamDocument, {
          input: {
            id: editing.id,
            examDate: form.examDate,
            staff: form.staff,
            notes: form.notes,
            sites,
          },
        })
        const updated = data.updatePerioExam
        setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
        setMessage('\u30da\u30ea\u30aa\u30c1\u30e3\u30fc\u30c8\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f')
      } else {
        const data = await gqlRequest(CreatePerioExamDocument, {
          input: {
            patientId,
            examDate: form.examDate,
            staff: form.staff,
            notes: form.notes,
            sites,
          },
        })
        setItems((prev) => [data.createPerioExam, ...prev])
        setMessage('\u30da\u30ea\u30aa\u30c1\u30e3\u30fc\u30c8\u3092\u767b\u9332\u3057\u307e\u3057\u305f')
      }
      resetForm()
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(exam: PerioExam) {
    if (!window.confirm(`\u691c\u67fb\u65e5 ${exam.examDate} \u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f`)) return
    setLoading(true)
    try {
      await gqlRequest(DeletePerioExamDocument, { id: exam.id })
      setItems((prev) => prev.filter((x) => x.id !== exam.id))
      if (editing?.id === exam.id) resetForm()
      setMessage('\u524a\u9664\u3057\u307e\u3057\u305f')
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel perio-panel">
      <h3>{'\u30da\u30ea\u30aa\u30c1\u30e3\u30fc\u30c8'} ({items.length})</h3>

      <form className="saas-form perio-form" onSubmit={onSubmit}>
        <h4>{editing ? '\u691c\u67fb\u3092\u66f4\u65b0' : '\u65b0\u898f\u691c\u67fb'}</h4>
        <div className="form-row">
          <label>
            {'\u691c\u67fb\u65e5'}
            <input
              type="date"
              value={form.examDate}
              onChange={(e) => setForm({ ...form, examDate: e.target.value })}
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
        </div>
        <label>
          {'\u30e1\u30e2'}
          <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </label>

        <p className="perio-tooth-label">{'\u691c\u67fb\u7259\u3092\u9078\u629e'}</p>
        <div className="perio-tooth-picker">
          {FDI_TEETH.map((tooth) => (
            <button
              key={tooth}
              type="button"
              className={`tooth-btn sm ${selectedTeeth.includes(tooth) ? 'selected' : ''}`}
              onClick={() => toggleTooth(tooth)}
            >
              {tooth}
            </button>
          ))}
        </div>

        {form.sites.length > 0 ? (
          <div className="perio-sites-table-wrap">
            <table className="data-table perio-sites-table">
              <thead>
                <tr>
                  <th>{'\u7259'}</th>
                  <th>{'PD-M'}</th>
                  <th>{'PD-B'}</th>
                  <th>{'PD-D'}</th>
                  <th>{'PD-L'}</th>
                  <th>{'BOP'}</th>
                  <th>{'Mob'}</th>
                </tr>
              </thead>
              <tbody>
                {form.sites.map((s) => (
                  <tr key={s.tooth}>
                    <td>{s.tooth}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={12}
                        value={s.pdMesial}
                        onChange={(e) => updateSite(s.tooth, { pdMesial: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={12}
                        value={s.pdBuccal}
                        onChange={(e) => updateSite(s.tooth, { pdBuccal: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={12}
                        value={s.pdDistal}
                        onChange={(e) => updateSite(s.tooth, { pdDistal: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={12}
                        value={s.pdLingual}
                        onChange={(e) => updateSite(s.tooth, { pdLingual: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={s.bop}
                        onChange={(e) => updateSite(s.tooth, { bop: e.target.checked })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={3}
                        value={s.mobility}
                        onChange={(e) => updateSite(s.tooth, { mobility: e.target.value })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

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

      {message ? <div className="alert">{message}</div> : null}

      {items.length === 0 ? (
        <p className="panel-empty">{'\u30da\u30ea\u30aa\u691c\u67fb\u306e\u8a18\u9332\u304c\u3042\u308a\u307e\u305b\u3093'}</p>
      ) : (
        <div className="perio-history">
          {items.map((exam) => (
            <article key={exam.id} className="perio-exam-card">
              <header>
                <strong>{exam.examDate}</strong>
                <span>{exam.staff}</span>
                {exam.notes ? <span className="muted">{exam.notes}</span> : null}
              </header>
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th>{'\u7259'}</th>
                    <th>{'M'}</th>
                    <th>{'B'}</th>
                    <th>{'D'}</th>
                    <th>{'L'}</th>
                    <th>{'BOP'}</th>
                    <th>{'Mob'}</th>
                  </tr>
                </thead>
                <tbody>
                  {exam.sites.map((s) => (
                    <tr key={`${exam.id}-${s.tooth}`} className={s.bop ? 'bop-positive' : ''}>
                      <td>{s.tooth}</td>
                      <td>{s.pdMesial}</td>
                      <td>{s.pdBuccal}</td>
                      <td>{s.pdDistal}</td>
                      <td>{s.pdLingual}</td>
                      <td>{s.bop ? '+' : '-'}</td>
                      <td>{s.mobility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="action-links">
                <button type="button" className="btn ghost sm" disabled={loading} onClick={() => startEdit(exam)}>
                  {'\u4fee\u6b63'}
                </button>
                <button type="button" className="btn ghost sm danger" disabled={loading} onClick={() => onDelete(exam)}>
                  {'\u524a\u9664'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
