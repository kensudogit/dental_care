const map: Record<string, string> = {
  confirmed: '確定',
  pending: '未確定',
  cancelled: 'キャンセル',
  completed: '完了',
  in_progress: '継続',
}

export function StatusBadge({ status }: { status: string }) {
  const label = map[status] ?? status
  return <span className={`badge badge-${status.replace('_', '-')}`}>{label}</span>
}

