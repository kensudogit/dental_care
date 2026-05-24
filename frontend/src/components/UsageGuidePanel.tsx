'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'dentalcare-usage-guide-v1'
const PANEL_WIDTH = 340

const L = {
  title: '\u5229\u7528\u624b\u9806',
  dragHint: '\u30c9\u30e9\u30c3\u30b0\u3067\u79fb\u52d5',
  expand: '\u958b\u304f',
  collapse: '\u9589\u3058\u308b',
  footer:
    '\u25bc\u25b2 \u3067\u958b\u9589\u3001\u30d8\u30c3\u30c0\u30fc\u3092\u30c9\u30e9\u30c3\u30b0\u3057\u3066\u4f4d\u7f6e\u3092\u79fb\u52d5\u3067\u304d\u307e\u3059\u3002',
  steps: [
    {
      title: '1. Dashboard',
      body: '\u672c\u65e5\u306e\u4e88\u7d04\u30fb\u60a3\u8005\u6570\u30fb\u8a3a\u7642\u4ef6\u6570\u306e\u6982\u8981\u3092\u78ba\u8a8d\u3057\u307e\u3059\u3002',
    },
    {
      title: '2. \u60a3\u8005\u7ba1\u7406',
      body: '\u60a3\u8005\u4e00\u89a7\u3067\u30ab\u30eb\u30c6No\u3092\u30af\u30ea\u30c3\u30af\u3057\u3066\u8a73\u7d30\u3078\u3002\u96fb\u8a71\u756a\u53f7\u3092\u30af\u30ea\u30c3\u30af\u3059\u308b\u3068\u767a\u4fe1\u3067\u304d\u307e\u3059\u3002',
    },
    {
      title: '3. \u4e88\u7d04',
      body: '\u4e88\u7d04\u30ab\u30ec\u30f3\u30c0\u30fc\u3067\u78ba\u8a8d\u30fb\u30ad\u30e3\u30f3\u30bb\u30eb\u30fb\u30ea\u30de\u30a4\u30f3\u30c9\u3092\u64cd\u4f5c\u3067\u304d\u307e\u3059\u3002',
    },
    {
      title: '4. \u8a3a\u7642\u8a18\u9332',
      body: '\u51e6\u7f6e\u4e00\u89a7\u3067\u53e3\u8154\u30ec\u30f3\u30c8\u30b2\u30f3\u30fb\u30ab\u30eb\u30c6\u5217\u306e\u767b\u9332/\u4fee\u6b63/\u524a\u9664\u30dc\u30bf\u30f3\u3092\u5229\u7528\u3067\u304d\u307e\u3059\u3002',
    },
    {
      title: '5. \u30ab\u30eb\u30c6\u7ba1\u7406',
      body: '\u60a3\u8005\u8a73\u7d30\u307e\u305f\u306f\u8a3a\u7642\u8a18\u9332\u304b\u3089\u30ab\u30eb\u30c6\u753b\u9762\u3078\u9077\u79fb\u3057\u3001\u8a3a\u7642\u5185\u5bb9\u3092\u767b\u9332\u30fb\u66f4\u65b0\u3067\u304d\u307e\u3059\u3002',
    },
    {
      title: '6. \u8a2d\u5b9a',
      body: '\u7d44\u7e54\u60c5\u5831\u30fb\u30c1\u30fc\u30e0\u30fbAPI\u30ad\u30fc\u306a\u3069\u306e\u30af\u30ea\u30cb\u30c3\u30af\u8a2d\u5b9a\u3092\u884c\u3044\u307e\u3059\u3002',
    },
  ],
} as const

type SavedState = {
  x: number
  y: number
  expanded: boolean
}

function defaultPosition() {
  if (typeof window === 'undefined') return { x: 24, y: 24 }
  const x = Math.max(16, window.innerWidth - PANEL_WIDTH - 24)
  const y = Math.max(16, window.innerHeight - 380)
  return { x, y }
}

function clampPosition(x: number, y: number, width: number, height: number) {
  const maxX = Math.max(8, window.innerWidth - width - 8)
  const maxY = Math.max(8, window.innerHeight - height - 8)
  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(8, y), maxY),
  }
}

export function UsageGuidePanel() {
  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)

  const [ready, setReady] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [pos, setPos] = useState({ x: 24, y: 24 })
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedState
        setPos({ x: parsed.x, y: parsed.y })
        setExpanded(parsed.expanded)
      } catch {
        setPos(defaultPosition())
      }
    } else {
      setPos(defaultPosition())
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const payload: SavedState = { ...pos, expanded }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [pos, expanded, ready])

  useEffect(() => {
    if (!ready) return
    const onResize = () => {
      const el = panelRef.current
      if (!el) return
      setPos((current) => clampPosition(current.x, current.y, el.offsetWidth, el.offsetHeight))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [ready])

  const onHeaderPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if ((e.target as HTMLElement).closest('.usage-guide-toggle')) return
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originX: pos.x,
        originY: pos.y,
      }
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [pos.x, pos.y],
  )

  const onHeaderPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const el = panelRef.current
    const width = el?.offsetWidth ?? PANEL_WIDTH
    const height = el?.offsetHeight ?? 120
    const next = clampPosition(
      drag.originX + (e.clientX - drag.startX),
      drag.originY + (e.clientY - drag.startY),
      width,
      height,
    )
    setPos(next)
  }, [])

  const onHeaderPointerUp = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    dragRef.current = null
    setDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }, [])

  if (!ready) return null

  return (
    <div
      ref={panelRef}
      className={`usage-guide-panel${expanded ? ' is-expanded' : ' is-collapsed'}${dragging ? ' is-dragging' : ''}`}
      style={{ left: pos.x, top: pos.y, width: PANEL_WIDTH }}
      role="dialog"
      aria-label={L.title}
      aria-expanded={expanded}
    >
      <header
        className="usage-guide-header"
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        onPointerCancel={onHeaderPointerUp}
      >
        <div className="usage-guide-header-text">
          <span className="usage-guide-drag-icon" aria-hidden>
            {'\u2630'}
          </span>
          <strong>{L.title}</strong>
          <span className="usage-guide-drag-hint">{L.dragHint}</span>
        </div>
        <button
          type="button"
          className="usage-guide-toggle"
          aria-label={expanded ? L.collapse : L.expand}
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? '\u25BC' : '\u25B2'}
        </button>
      </header>

      {expanded ? (
        <div className="usage-guide-body">
          <ol className="usage-guide-steps">
            {L.steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="usage-guide-footer">{L.footer}</p>
        </div>
      ) : null}
    </div>
  )
}
