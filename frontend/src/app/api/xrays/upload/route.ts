import { mkdir, unlink, writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads', 'xrays')
const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

function extForType(type: string) {
  switch (type) {
    case 'image/jpeg':
      return '.jpg'
    case 'image/png':
      return '.png'
    case 'image/webp':
      return '.webp'
    case 'image/gif':
      return '.gif'
    default:
      return '.bin'
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    const patientId = String(form.get('patientId') ?? '').trim()

    if (!patientId || !(file instanceof File)) {
      return NextResponse.json({ error: 'patientId and file are required' }, { status: 400 })
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const safePatient = patientId.replace(/[^a-zA-Z0-9_-]/g, '')
    const dir = path.join(UPLOAD_ROOT, safePatient)
    await mkdir(dir, { recursive: true })

    const name = `${Date.now()}${extForType(file.type)}`
    const diskPath = path.join(dir, name)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(diskPath, buffer)

    const url = `/uploads/xrays/${safePatient}/${name}`
    return NextResponse.json({ url })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const imageUrl = searchParams.get('url')?.trim()
    if (!imageUrl || !imageUrl.startsWith('/uploads/xrays/')) {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
    }
    if (imageUrl.includes('placeholder.svg')) {
      return NextResponse.json({ ok: true })
    }

    const relative = imageUrl.replace(/^\/uploads\/xrays\//, '')
    const diskPath = path.join(UPLOAD_ROOT, relative)
    const resolved = path.resolve(diskPath)
    if (!resolved.startsWith(path.resolve(UPLOAD_ROOT))) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    await unlink(resolved).catch(() => undefined)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Delete failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
