'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import {
  CreateXrayImageDocument,
  DeleteXrayImageDocument,
  UpdateXrayImageDocument,
  XrayImageType,
  type PatientXraysQuery,
} from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

type Xray = PatientXraysQuery['xrayImages'][number]

const IMAGE_TYPES: { value: XrayImageType; label: string }[] = [
  { value: XrayImageType.Panoramic, label: '\u30d1\u30ce\u30e9\u30de' },
  { value: XrayImageType.Periapical, label: '\u30c7\u30f3\u30bf\u30eb' },
  { value: XrayImageType.Bitewing, label: '\u30d0\u30a4\u30c8\u30a6\u30a3\u30f3\u30b0' },
  { value: XrayImageType.Cephalometric, label: '\u30bb\u30d5\u30a1\u30ed' },
]

const typeLabel = (t: string) => IMAGE_TYPES.find((x) => x.value === t)?.label ?? t

type FormState = {
  title: string
  imageType: XrayImageType
  toothRegion: string
  takenAt: string
  notes: string
}

const emptyForm = (): FormState => ({
  title: '',
  imageType: XrayImageType.Panoramic,
  toothRegion: '\u5168\u4f53',
  takenAt: new Date().toISOString().slice(0, 10),
  notes: '',
})

export function XrayGallery({
  patientId,
  initial,
}: {
  patientId: string
  initial: Xray[]
}) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Xray | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const resetForm = useCallback(() => {
    setEditing(null)
    setForm(emptyForm())
    setFile(null)
    setPreview(null)
  }, [])

  async function uploadFile(f: File): Promise<string> {
    const body = new FormData()
    body.append('patientId', patientId)
    body.append('file', f)
    const res = await fetch('/api/xrays/upload', { method: 'POST', body })
    const json = (await res.json()) as { url?: string; error?: string }
    if (!res.ok || !json.url) {
      throw new Error(json.error ?? 'Upload failed')
    }
    return json.url
  }

  async function deleteFile(url: string) {
    if (!url.startsWith('/uploads/xrays/') || url.includes('placeholder.svg')) return
    await fetch(`/api/xrays/upload?url=${encodeURIComponent(url)}`, { method: 'DELETE' })
  }

  function startEdit(x: Xray) {
    setEditing(x)
    setForm({
      title: x.title,
      imageType: x.imageType as XrayImageType,
      toothRegion: x.toothRegion,
      takenAt: x.takenAt,
      notes: x.notes,
    })
    setFile(null)
    setPreview(null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      let imageUrl = editing?.imageUrl ?? ''
      if (file) {
        imageUrl = await uploadFile(file)
        if (editing?.imageUrl && editing.imageUrl !== imageUrl) {
          await deleteFile(editing.imageUrl)
        }
      }
      if (!editing && !file) {
        throw new Error('\u753b\u50cf\u30d5\u30a1\u30a4\u30eb\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044')
      }

      if (editing) {
        const result = await gqlRequest(UpdateXrayImageDocument, {
          input: {
            id: editing.id,
            title: form.title,
            imageUrl: file ? imageUrl : undefined,
            imageType: form.imageType,
            toothRegion: form.toothRegion,
            takenAt: form.takenAt,
            notes: form.notes,
          },
        })
        setItems((prev) =>
          prev.map((x) => (x.id === editing.id ? { ...x, ...result.updateXrayImage } : x)),
        )
        setMessage('\u30ec\u30f3\u30c8\u30b2\u30f3\u5199\u771f\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f')
      } else {
        const result = await gqlRequest(CreateXrayImageDocument, {
          input: {
            patientId,
            title: form.title,
            imageUrl,
            imageType: form.imageType,
            toothRegion: form.toothRegion,
            takenAt: form.takenAt,
            notes: form.notes,
          },
        })
        setItems((prev) => [result.createXrayImage as Xray, ...prev])
        setMessage('\u30ec\u30f3\u30c8\u30b2\u30f3\u5199\u771f\u3092\u767b\u9332\u3057\u307e\u3057\u305f')
      }
      resetForm()
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(x: Xray) {
    if (!confirm(`\u300c${x.title}\u300d\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f`)) return
    setLoading(true)
    setMessage(null)
    try {
      await gqlRequest(DeleteXrayImageDocument, { id: x.id })
      await deleteFile(x.imageUrl)
      setItems((prev) => prev.filter((i) => i.id !== x.id))
      if (editing?.id === x.id) resetForm()
      setMessage('\u524a\u9664\u3057\u307e\u3057\u305f')
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  function onFileChange(f: File | null) {
    setFile(f)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  return (
    <section id="xray" className="panel xray-panel">
      <div className="xray-panel-head">
        <h3>{'\u53e3\u8154\u30ec\u30f3\u30c8\u30b2\u30f3'} ({items.length})</h3>
        <p className="muted">JPEG / PNG / WebP (max 10MB)</p>
      </div>

      <form id="xray-form" className="saas-form xray-form" onSubmit={onSubmit}>
        <h4>{editing ? '\u5199\u771f\u3092\u66f4\u65b0' : '\u65b0\u898f\u767b\u9332'}</h4>
        <div className="form-row">
          <label>
            {'\u30bf\u30a4\u30c8\u30eb'}
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>
          <label>
            {'\u7a2e\u985e'}
            <select
              value={form.imageType}
              onChange={(e) => setForm({ ...form, imageType: e.target.value as XrayImageType })}
            >
              {IMAGE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            {'\u64ae\u5f71\u90e8\u4f4d'}
            <input
              value={form.toothRegion}
              onChange={(e) => setForm({ ...form, toothRegion: e.target.value })}
            />
          </label>
          <label>
            {'\u64ae\u5f71\u65e5'}
            <input
              type="date"
              value={form.takenAt}
              onChange={(e) => setForm({ ...form, takenAt: e.target.value })}
              required
            />
          </label>
        </div>
        <label>
          {'\u30e1\u30e2'}
          <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </label>
        <label>
          {'\u753b\u50cf\u30d5\u30a1\u30a4\u30eb'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            required={!editing}
          />
        </label>
        {(preview || editing?.imageUrl) && (
          <div className="xray-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview ?? editing?.imageUrl} alt="preview" />
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '...' : editing ? '\u66f4\u65b0' : '\u767b\u9332'}
          </button>
          {editing ? (
            <button type="button" className="btn-ghost" onClick={resetForm}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {message ? <p className="form-status">{message}</p> : null}

      {items.length === 0 ? (
        <p className="panel-empty">No x-ray images</p>
      ) : (
        <div id="xray-list" className="xray-grid">
          {items.map((x) => (
            <article key={x.id} className="xray-card">
              <div className="xray-thumb">
                <Image src={x.imageUrl} alt={x.title} fill sizes="240px" className="xray-img" unoptimized />
              </div>
              <div className="xray-card-body">
                <h4>{x.title}</h4>
                <p className="xray-meta">
                  {typeLabel(x.imageType)} / {x.toothRegion} / {x.takenAt}
                </p>
                {x.notes ? <p className="xray-notes">{x.notes}</p> : null}
                <div className="xray-actions">
                  <button type="button" className="btn-ghost" onClick={() => startEdit(x)}>
                    Edit
                  </button>
                  <button type="button" className="btn-ghost danger" onClick={() => onDelete(x)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
