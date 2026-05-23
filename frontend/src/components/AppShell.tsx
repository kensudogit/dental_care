'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconCalendar, IconDashboard, IconPatients, IconRecords } from './NavIcons'

const nav = [
  { href: '/', label: 'ダッシュボード', Icon: IconDashboard },
  { href: '/patients', label: '患者管理', Icon: IconPatients },
  { href: '/appointments', label: '予約・診療台', Icon: IconCalendar },
  { href: '/treatments', label: '診療記録', Icon: IconRecords },
] as const

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-glow" aria-hidden />
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
            <div className="brand-sub">歯科医療プラットフォーム</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {nav.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
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
          <div>
            <p className="topbar-eyebrow">Clinic Operations</p>
            <h1 className="topbar-title">歯科医療DX</h1>
          </div>
          <div className="topbar-actions">
            <span className="clinic-chip">デモクリニック</span>
            <span className="live-chip">Live</span>
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
