'use client'

import { useCallback, useMemo } from 'react'

export type ToothCondition =
  | 'healthy'
  | 'caries'
  | 'filling'
  | 'crown'
  | 'missing'
  | 'calculus'
  | 'perio'
  | 'endo'

export type ToothChartData = {
  selected: string[]
  conditions: Record<string, ToothCondition>
}

const UPPER_RIGHT = ['18', '17', '16', '15', '14', '13', '12', '11']
const UPPER_LEFT = ['21', '22', '23', '24', '25', '26', '27', '28']
const LOWER_LEFT = ['38', '37', '36', '35', '34', '33', '32', '31']
const LOWER_RIGHT = ['41', '42', '43', '44', '45', '46', '47', '48']

export const FDI_TEETH = [...UPPER_RIGHT, ...UPPER_LEFT, ...LOWER_LEFT, ...LOWER_RIGHT]

const CONDITION_OPTIONS: { value: ToothCondition; label: string }[] = [
  { value: 'healthy', label: '\u5065\u5eb7' },
  { value: 'caries', label: '\u3046\u9b40' },
  { value: 'filling', label: '\u5145\u586b' },
  { value: 'crown', label: '\u51a0' },
  { value: 'missing', label: '\u6b20\u640d' },
  { value: 'calculus', label: '\u6b6f\u77f3' },
  { value: 'perio', label: '\u6b6f\u5468' },
  { value: 'endo', label: '\u6839\u7ba1' },
]

export function emptyToothChart(): ToothChartData {
  return { selected: [], conditions: {} }
}

export function parseToothChartJson(raw: string | null | undefined): ToothChartData {
  if (!raw?.trim()) return emptyToothChart()
  try {
    const parsed = JSON.parse(raw) as Partial<ToothChartData>
    return {
      selected: Array.isArray(parsed.selected) ? parsed.selected.filter(Boolean) : [],
      conditions: parsed.conditions && typeof parsed.conditions === 'object' ? parsed.conditions : {},
    }
  } catch {
    return emptyToothChart()
  }
}

export function serializeToothChart(data: ToothChartData): string {
  return JSON.stringify(data)
}

type Props = {
  value: ToothChartData
  onChange: (next: ToothChartData) => void
  compact?: boolean
}

export function ToothChart({ value, onChange, compact }: Props) {
  const selectedSet = useMemo(() => new Set(value.selected), [value.selected])

  const toggleTooth = useCallback(
    (tooth: string) => {
      const next = new Set(value.selected)
      if (next.has(tooth)) {
        next.delete(tooth)
      } else {
        next.add(tooth)
      }
      onChange({ ...value, selected: [...next].sort() })
    },
    [onChange, value],
  )

  const setCondition = useCallback(
    (tooth: string, condition: ToothCondition) => {
      onChange({
        ...value,
        conditions: { ...value.conditions, [tooth]: condition },
      })
    },
    [onChange, value],
  )

  const activeTooth = value.selected.length === 1 ? value.selected[0] : null

  function renderRow(teeth: string[], label: string) {
    return (
      <div className="tooth-row">
        <span className="tooth-row-label">{label}</span>
        <div className="tooth-row-teeth">
          {teeth.map((tooth) => {
            const selected = selectedSet.has(tooth)
            const condition = value.conditions[tooth] ?? 'healthy'
            return (
              <button
                key={tooth}
                type="button"
                className={`tooth-btn ${selected ? 'selected' : ''} cond-${condition}`}
                onClick={() => toggleTooth(tooth)}
                title={`${tooth} ${CONDITION_OPTIONS.find((c) => c.value === condition)?.label ?? ''}`}
              >
                {tooth}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={`tooth-chart ${compact ? 'compact' : ''}`}>
      <div className="tooth-chart-grid">
        {renderRow(UPPER_RIGHT, '\u53f3\u4e0a')}
        {renderRow(UPPER_LEFT, '\u5de6\u4e0a')}
        {renderRow(LOWER_LEFT, '\u5de6\u4e0b')}
        {renderRow(LOWER_RIGHT, '\u53f3\u4e0b')}
      </div>
      {activeTooth ? (
        <div className="tooth-condition-bar">
          <span>
            {'\u7259\u756a\u53f7'} {activeTooth}
          </span>
          <select
            value={value.conditions[activeTooth] ?? 'healthy'}
            onChange={(e) => setCondition(activeTooth, e.target.value as ToothCondition)}
          >
            {CONDITION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="muted tooth-chart-hint">
          {'\u7259\u3092\u30af\u30ea\u30c3\u30af\u3057\u3066\u9078\u629e\u30011\u672c\u9078\u629e\u6642\u306b\u72b6\u614b\u3092\u8a2d\u5b9a\u3067\u304d\u307e\u3059\u3002'}
        </p>
      )}
      {value.selected.length > 0 ? (
        <p className="tooth-selected-summary">
          {'\u9078\u629e'}: {value.selected.join(', ')}
        </p>
      ) : null}
    </div>
  )
}
