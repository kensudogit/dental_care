export type ProcedurePreset = {
  code: string
  label: string
  defaultFee?: number
}

export const PROCEDURE_PRESETS: ProcedurePreset[] = [
  { code: 'M011', label: '\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0', defaultFee: 3300 },
  { code: 'M012', label: '\u6839\u7ba1\u6cbb\u7642', defaultFee: 12000 },
  { code: 'M013', label: 'CR\u5145\u586b', defaultFee: 8500 },
  { code: 'M014', label: '\u629c\u6b69', defaultFee: 5500 },
  { code: 'M301', label: '\u77ef\u6b63\u8abf\u6574', defaultFee: 8800 },
  { code: 'M401', label: 'PMTC', defaultFee: 5500 },
  { code: 'M402', label: '\u30d5\u30ed\u30b9\u6307\u5c0e', defaultFee: 2200 },
  { code: 'M501', label: '\u6b6f\u5468\u6cd5\u51e6\u7f6e', defaultFee: 4400 },
  { code: 'M601', label: '\u30a4\u30f3\u30d7\u30e9\u30f3\u30c8', defaultFee: 88000 },
  { code: 'M701', label: '\u521d\u8a3a\u6599', defaultFee: 3300 },
]

export function findProcedurePreset(code: string) {
  return PROCEDURE_PRESETS.find((p) => p.code === code)
}
