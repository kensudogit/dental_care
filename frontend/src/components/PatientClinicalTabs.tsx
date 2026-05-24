'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PhoneLink } from '@/components/PhoneLink'
import { StatusBadge } from '@/components/StatusBadge'
import {
  UpdatePatientProfileDocument,
  UpsertInsuranceDocument,
  type PatientClinicalProfileQuery,
} from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

type Profile = NonNullable<PatientClinicalProfileQuery['patientProfile']>

const TABS = [
  { id: 'overview', label: '\u57fa\u672c\u60c5\u5831' },
  { id: 'insurance', label: '\u4fdd\u967a' },
  { id: 'history', label: '\u75c5\u6b74\u30fb\u30a2\u30ec\u30eb\u30ae\u30fc' },
  { id: 'family', label: '\u5bb6\u65cf\u30fb\u9023\u7d61\u5148' },
  { id: 'questionnaire', label: '\u554f\u8a3a\u7968' },
  { id: 'visits', label: '\u6765\u9662\u5c65\u6b74' },
] as const

type TabId = (typeof TABS)[number]['id']

export function PatientClinicalTabs({ initial }: { initial: Profile }) {
  const router = useRouter()
  const [tab, setTab] = useState<TabId>('overview')
  const [profile, setProfile] = useState(initial)
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [profileForm, setProfileForm] = useState({
    gender: profile.gender,
    address: profile.address,
    phone: profile.phone,
    email: profile.email,
    notes: profile.notes,
  })

  const [insuranceForm, setInsuranceForm] = useState({
    insurerName: profile.insurance?.insurerName ?? '',
    symbol: profile.insurance?.symbol ?? '',
    number: profile.insurance?.number ?? '',
    copayCategory: profile.insurance?.copayCategory ?? '',
    validUntil: profile.insurance?.validUntil ?? '',
  })

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const data = await gqlRequest(UpdatePatientProfileDocument, {
        input: { id: profile.id, ...profileForm },
      })
      if (data.updatePatientProfile) {
        setProfile(data.updatePatientProfile)
        setMessage('\u4fdd\u5b58\u3057\u307e\u3057\u305f')
        router.refresh()
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setSaving(false)
    }
  }

  async function saveInsurance(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const data = await gqlRequest(UpsertInsuranceDocument, {
        input: { patientId: profile.id, ...insuranceForm },
      })
      setProfile((prev) => ({ ...prev, insurance: data.upsertInsurance }))
      setMessage('\u4fdd\u967a\u60c5\u5831\u3092\u4fdd\u5b58\u3057\u307e\u3057\u305f')
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="panel">
      <nav className="patient-tabs" aria-label="Patient sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`patient-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {message ? <p className="form-status">{message}</p> : null}

      {tab === 'overview' ? (
        <form className="saas-form" onSubmit={saveProfile}>
          <dl className="info-grid">
            <dt>\u751f\u5e74\u6708\u65e5</dt>
            <dd>{profile.birthDate}</dd>
            <dt>\u6027\u5225</dt>
            <dd>
              <input
                value={profileForm.gender}
                onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
              />
            </dd>
            <dt>\u4f4f\u6240</dt>
            <dd>
              <input
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              />
            </dd>
            <dt>\u96fb\u8a71</dt>
            <dd>
              <input
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </dd>
            <dt>\u30e1\u30fc\u30eb</dt>
            <dd>
              <input
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </dd>
            <dt>\u5099\u8003</dt>
            <dd>
              <input
                value={profileForm.notes}
                onChange={(e) => setProfileForm({ ...profileForm, notes: e.target.value })}
              />
            </dd>
          </dl>
          <div className="form-actions">
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? '\u4fdd\u5b58\u4e2d...' : '\u57fa\u672c\u60c5\u5831\u3092\u4fdd\u5b58'}
            </button>
          </div>
        </form>
      ) : null}

      {tab === 'insurance' ? (
        <form className="saas-form" onSubmit={saveInsurance}>
          <label>
            \u4fdd\u967a\u8005\u540d
            <input
              value={insuranceForm.insurerName}
              onChange={(e) => setInsuranceForm({ ...insuranceForm, insurerName: e.target.value })}
              required
            />
          </label>
          <label>
            \u8a18\u53f7\u30fb\u756a\u53f7
            <input
              value={insuranceForm.symbol}
              onChange={(e) => setInsuranceForm({ ...insuranceForm, symbol: e.target.value })}
              required
            />
          </label>
          <label>
            \u88ab\u4fdd\u967a\u8005\u756a\u53f7
            <input
              value={insuranceForm.number}
              onChange={(e) => setInsuranceForm({ ...insuranceForm, number: e.target.value })}
              required
            />
          </label>
          <label>
            \u8ca0\u62c5\u533a\u5206
            <input
              value={insuranceForm.copayCategory}
              onChange={(e) => setInsuranceForm({ ...insuranceForm, copayCategory: e.target.value })}
              required
            />
          </label>
          <label>
            \u6709\u52b9\u671f\u9650
            <input
              type="date"
              value={insuranceForm.validUntil}
              onChange={(e) => setInsuranceForm({ ...insuranceForm, validUntil: e.target.value })}
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? '\u4fdd\u5b58\u4e2d...' : '\u4fdd\u967a\u60c5\u5831\u3092\u4fdd\u5b58'}
            </button>
          </div>
        </form>
      ) : null}

      {tab === 'history' ? (
        <>
          <h4>\u75c5\u6b74</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>\u75c5\u540d</th>
                <th>\u8a3a\u65ad\u65e5</th>
                <th>\u5099\u8003</th>
                <th>\u653e\u5c48</th>
              </tr>
            </thead>
            <tbody>
              {(profile.medicalHistories ?? []).map((h) => (
                <tr key={h.id}>
                  <td>{h.condition}</td>
                  <td>{h.diagnosedAt}</td>
                  <td>{h.notes || '\u2014'}</td>
                  <td>{h.resolved ? '\u306f\u3044' : '\u3044\u3044\u3048'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>\u30a2\u30ec\u30eb\u30ae\u30fc\u8a18\u9332</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>\u7269\u8cea</th>
                <th>\u91cd\u7a0b\u5ea6</th>
                <th>\u53cd\u5fdc</th>
              </tr>
            </thead>
            <tbody>
              {(profile.allergyRecords ?? []).map((a) => (
                <tr key={a.id}>
                  <td>{a.substance}</td>
                  <td>{a.severity}</td>
                  <td>{a.reaction}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted">\u30c6\u30ad\u30b9\u30c8\u30a2\u30ec\u30eb\u30ae\u30fc: {profile.allergies || '\u306a\u3057'}</p>
        </>
      ) : null}

      {tab === 'family' ? (
        <>
          <h4>\u5bb6\u65cf</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>\u6c0f\u540d</th>
                <th>\u95a2\u4fc2</th>
                <th>\u96fb\u8a71</th>
              </tr>
            </thead>
            <tbody>
              {(profile.familyMembers ?? []).map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.relationship}</td>
                  <td><PhoneLink phone={m.phone} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>\u7dca\u6025\u9023\u7d61\u5148</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>\u6c0f\u540d</th>
                <th>\u95a2\u4fc2</th>
                <th>\u96fb\u8a71</th>
                <th>\u512a\u5148\u5ea6</th>
              </tr>
            </thead>
            <tbody>
              {(profile.emergencyContacts ?? []).map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.relationship}</td>
                  <td><PhoneLink phone={c.phone} /></td>
                  <td>{c.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      {tab === 'questionnaire' ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>\u63d0\u51fa\u65e5</th>
              <th>\u4e3b\u8a34</th>
              <th>\u670d\u85ac</th>
              <th>\u5438\u7159</th>
              <th>\u598a\u5a66</th>
              <th>\u4e0d\u5b89\u5ea6</th>
            </tr>
          </thead>
          <tbody>
            {(profile.questionnaires ?? []).map((q) => (
              <tr key={q.id}>
                <td>{q.submittedAt}</td>
                <td>{q.chiefComplaint}</td>
                <td>{q.currentMedications || '\u2014'}</td>
                <td>{q.smoking ? '\u306f\u3044' : '\u3044\u3044\u3048'}</td>
                <td>{q.pregnancy ? '\u306f\u3044' : '\u3044\u3044\u3048'}</td>
                <td>{q.dentalAnxiety}/10</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {tab === 'visits' ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>\u6765\u9662\u65e5</th>
              <th>\u7a2e\u5225</th>
              <th>\u6458\u8981</th>
              <th>\u62c5\u5f53</th>
              <th>\u72b6\u614b</th>
            </tr>
          </thead>
          <tbody>
            {(profile.visitHistory ?? []).map((v) => (
              <tr key={v.id}>
                <td>{v.visitDate}</td>
                <td>{v.visitType}</td>
                <td>{v.summary}</td>
                <td>{v.staff}</td>
                <td>
                  <StatusBadge status={v.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  )
}
