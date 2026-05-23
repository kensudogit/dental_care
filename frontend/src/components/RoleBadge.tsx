const labels: Record<string, string> = {
  OWNER: '????',
  ADMIN: '???',
  MEMBER: '????',
  VIEWER: '???',
}

export function RoleBadge({ role }: { role: string }) {
  return <span className={`role-badge role-${role.toLowerCase()}`}>{labels[role] ?? role}</span>
}

