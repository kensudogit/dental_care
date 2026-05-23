'use client'

import Image from 'next/image'
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
        <div className="sidebar-glow" aria-hidden />
        <div className="brand">
          <div className="brand-logo">
            <Image src="/icon.svg" alt="DentalCare DX" width={44} height={44} priority />
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
          <div className="topbar-brand">
            <Image src="/icon.svg" alt="" width={32} height={32} className="topbar-logo" aria-hidden />
            <div>
              <p className="topbar-eyebrow">Clinic Operations</p>
              <h1 className="topbar-title">DentalCare DX</h1>
            </div>
          </div>
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
