'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'dentalcare-usage-guide-v2'
const PANEL_WIDTH = 360

type GuideStep = {
  title: string
  body: string
  items?: readonly string[]
}

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
      title: '2. \u60a3\u8005\u4e00\u89a7',
      body: '\u5de6\u30e1\u30cb\u30e5\u30fc\u300cPatients\u300d\u3067\u60a3\u8005\u30ea\u30b9\u30c8\u3092\u8868\u793a\u3057\u307e\u3059\u3002',
      items: [
        '\u30ab\u30eb\u30c6No\uff08\u7dd1\u8272\u306e\u6587\u5b57\uff09\u3092\u30af\u30ea\u30c3\u30af \u2192 \u60a3\u8005\u8a73\u7d30\u753b\u9762\u3078\u9077\u79fb',
        '\u6c0f\u540d\u30fb\u884c\u5168\u4f53\u306f\u30af\u30ea\u30c3\u30af\u3067\u304d\u307e\u305b\u3093\uff08\u30ab\u30eb\u30c6No\u306e\u307f\u30ea\u30f3\u30af\uff09',
        '\u96fb\u8a71\u756a\u53f7\u3092\u30af\u30ea\u30c3\u30af\u3059\u308b\u3068\u767a\u4fe1\uff08tel:\uff09\u3067\u304d\u307e\u3059',
        '\u4f8b\uff1a\u30ab\u30eb\u30c610007 \u2192 /patients/p7',
      ],
    },
    {
      title: '3. \u60a3\u8005\u8a73\u7d30\u753b\u9762',
      body: '\u60a3\u8005\u4e00\u89a7\u3067\u30ab\u30eb\u30c6No\u3092\u30af\u30ea\u30c3\u30af\u3057\u305f\u5148\u306e\u753b\u9762\u3067\u3059\u3002',
      items: [
        '\u4e0a\u90e8\u306b\u60a3\u8005\u540d\u30fb\u30ab\u30eb\u30c6No\u30fb\u30d5\u30ea\u30ac\u30ca\u3092\u8868\u793a',
        '\u300c\u2190 \u60a3\u8005\u4e00\u89a7\u300d\u3067\u30ea\u30b9\u30c8\u306b\u623b\u308c\u307e\u3059',
        '\u30bf\u30d6\u3067\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u30fb\u4fdd\u967a\u30fb\u554f\u8a3a\u60c5\u5831\u3092\u78ba\u8a8d',
        '\u53e3\u8154\u30ec\u30f3\u30c8\u30b2\u30f3\u306e\u767b\u9332\u30fb\u4fee\u6b63\u30fb\u524a\u9664',
        '\u8a3a\u7642\u5c65\u6b74\u30c6\u30fc\u30d6\u30eb\u3067\u904e\u53bb\u306e\u51e6\u7f6e\u3092\u95b2\u89a7',
        '\u300c\u96fb\u5b50\u30ab\u30eb\u30c6\u3092\u958b\u304f\u300d\u30dc\u30bf\u30f3\u3067\u96fb\u5b50\u30ab\u30eb\u30c6\u3078',
      ],
    },
    {
      title: '4. \u96fb\u5b50\u30ab\u30eb\u30c6',
      body: '\u60a3\u8005\u8a73\u7d30\u306e\u300c\u96fb\u5b50\u30ab\u30eb\u30c6\u3092\u958b\u304f\u300d\u307e\u305f\u306f /patients/{id}/karte \u3067\u958b\u304d\u307e\u3059\u3002',
      items: [
        'SOAP\u30fb\u51e6\u7f6e \u2014 S/O/A/P\u3001\u6b6f\u5f0f\u3001\u51e6\u7f6e\u30b3\u30fc\u30c9\u3067\u767b\u9332',
        '\u6b6f\u5f0f \u2014 FDI\u6b6f\u5f0f\u30c1\u30e3\u30fc\u30c8\u3067\u7259\u306e\u72b6\u614b\u3092\u8a18\u9332',
        '\u6cbb\u7642\u5c65\u6b74 \u2014 \u904e\u53bb\u30ab\u30eb\u30c6\u306e\u4e00\u89a7\u30fb\u4fee\u6b63\u30fb\u524a\u9664',
        '\u30ec\u30f3\u30c8\u30b2\u30f3 \u2014 \u30d1\u30ce\u30e9\u30de\u30fb\u30c7\u30f3\u30bf\u30eb\u7b49\u306e\u753b\u50cf\u7ba1\u7406',
        '\u53e3\u8154\u5185\u5199\u771f \u2014 \u53e3\u8154\u5185\u64ae\u5f71\u306e\u7ba1\u7406',
        '\u30da\u30ea\u30aa \u2014 \u6b6f\u5468\u888b\u6df1\u5ea6\u30fbBOP\u30fb\u52d5\u63da\u5ea6\u306e\u691c\u67fb\u8a18\u9332',
      ],
    },
    {
      title: '5. \u4e88\u7d04',
      body: '\u4e88\u7d04\u30ab\u30ec\u30f3\u30c0\u30fc\u3067\u78ba\u8a8d\u30fb\u30ad\u30e3\u30f3\u30bb\u30eb\u30fb\u30ea\u30de\u30a4\u30f3\u30c9\u3092\u64cd\u4f5c\u3067\u304d\u307e\u3059\u3002',
    },
    {
      title: '6. \u8a3a\u7642\u8a18\u9332\uff08Records\uff09',
      body: '\u5168\u60a3\u8005\u306e\u51e6\u7f6e\u4e00\u89a7\u3067\u30ab\u30eb\u30c6\u64cd\u4f5c\u306b\u30a2\u30af\u30bb\u30b9\u3067\u304d\u307e\u3059\u3002',
      items: [
        '\u30ab\u30eb\u30c6\u5217\u306e\u300c\u767b\u9332/\u4fee\u6b63/\u524a\u9664\u300d\u2192 \u96fb\u5b50\u30ab\u30eb\u30c6\u753b\u9762\u3078\u76f4\u63a5\u9077\u79fb',
        '\u30ec\u30f3\u30c8\u30b2\u30f3\u5217\u306e\u30dc\u30bf\u30f3\u2192 \u60a3\u8005\u8a73\u7d30\u306e\u30ec\u30f3\u30c8\u30b2\u30f3\u30a8\u30ea\u30a2\u3078',
      ],
    },
    {
      title: '7. \u8a2d\u5b9a',
      body: '\u7d44\u7e54\u60c5\u5831\u30fb\u30c1\u30fc\u30e0\u30fbAPI\u30ad\u30fc\u306a\u3069\u306e\u30af\u30ea\u30cb\u30c3\u30af\u8a2d\u5b9a\u3092\u884c\u3044\u307e\u3059\u3002',
    },
  ] satisfies readonly GuideStep[],
} as const

type SavedState = {
  x: number
  y: number
  expanded: boolean
}

function defaultPosition() {
  if (typeof window === 'undefined') return { x: 24, y: 24 }
  const x = Math.max(16, window.innerWidth - PANEL_WIDTH - 24)
  const y = Math.max(16, window.innerHeight - 420)
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
      role="region"
      aria-label={L.title}
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
                {step.items?.length ? (
                  <ul className="usage-guide-items">
                    {step.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="usage-guide-footer">{L.footer}</p>
        </div>
      ) : null}
    </div>
  )
}
