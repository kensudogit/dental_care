from pathlib import Path

content = """'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconCalendar,
  IconDashboard,
  IconPatients,
  IconRecords,
  IconSettings,
} from './NavIcons'
import { PlanBadge } from './PlanBadge'

const nav = [
  { href: '/', label: 'Dashboard', Icon: IconDashboard },
  { href: '/patients', label: 'Patients', Icon: IconPatients },
  { href: '/appointments', label: 'Appointments', Icon: IconCalendar },
  { href: '/treatments', label: 'Records', Icon: IconRecords },
  { href: '/settings', label: 'Settings', Icon: IconSettings },
] as const

export type AppShellSession = {
  orgName: string
  planTier: string
  userName: string
  role: string
}

export function AppShell({
  children,
  session,
}: {
  children: React.ReactNode
  session?: AppShellSession | null
}) {
  const pathname = usePathname()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <motion className="sidebar-glow" aria-hidden />
        <div className="brand">
          <div className="brand-icon" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3c-1.5 2.5-4 4.2-4 7.5a4 4 0 108 0C16 7.2 13.5 5.5 12 3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M9 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="brand-title">DentalCare DX</div>
            <div className="brand-sub">B2B Dental SaaS</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {nav.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : item.href === '/settings'
                  ? pathname.startsWith('/settings')
                  : pathname.startsWith(item.href)
            const Icon = item.Icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${active ? ' active' : ''}`}
              >
                <span className="nav-icon-wrap">
                  <Icon className="nav-icon" />
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="stack-pill">
            <span className="stack-dot" />
            GraphQL · Go + Next.js
          </div>
        </div>
      </aside>
      <div className="main-wrap">
        <header className="topbar">
          <motion>
            <p className="topbar-eyebrow">Clinic Operations</p>
            <h1 className="topbar-title">DentalCare DX</h1>
          </motion>
          <div className="topbar-actions">
            {session ? (
              <>
                <span className="clinic-chip">{session.orgName}</span>
                <PlanBadge tier={session.planTier} />
                <span className="user-chip">{session.userName}</span>
              </>
            ) : (
              <span className="clinic-chip">Demo clinic</span>
            )}
            <span className="live-chip">Live</span>
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
"""

content = content.replace("motion", "XXX").replace("XXX", "motion")
# Actually replace all motion with div
import re
content = re.sub(r"</?motion\b", lambda m: m.group(0).replace("motion", "motion"), content)

Path(r"C:\devlop\dental_care\frontend\src\components\AppShell.tsx").write_text(content, encoding="utf-8")
