'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  IconCalendar,
  IconDashboard,
  IconPatients,
  IconRecords,
  IconSettings,
} from './NavIcons'
import { PlanBadge } from './PlanBadge'
import { UsageGuidePanel } from './UsageGuidePanel'

const nav = [
  { href: '/', label: 'Dashboard', shortLabel: '\u30db\u30fc\u30e0', Icon: IconDashboard },
  { href: '/patients', label: 'Patients', shortLabel: '\u60a3\u8005', Icon: IconPatients },
  { href: '/appointments', label: 'Appointments', shortLabel: '\u4e88\u7d04', Icon: IconCalendar },
  { href: '/treatments', label: 'Records', shortLabel: '\u8a18\u9332', Icon: IconRecords },
  { href: '/settings', label: 'Settings', shortLabel: '\u8a2d\u5b9a', Icon: IconSettings },
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
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.classList.toggle('mobile-nav-open', navOpen)
    return () => document.body.classList.remove('mobile-nav-open')
  }, [navOpen])

  const closeNav = () => setNavOpen(false)

  return (
    <div className={`app-shell${navOpen ? ' nav-open' : ''}`}>
      <button
        type="button"
        className="sidebar-backdrop"
        aria-label="\u30e1\u30cb\u30e5\u30fc\u3092\u9589\u3058\u308b"
        onClick={closeNav}
      />
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
                onClick={closeNav}
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
          <button
            type="button"
            className="nav-menu-btn"
            aria-label="\u30e1\u30cb\u30e5\u30fc\u3092\u958b\u304f"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((open) => !open)}
          >
            <span className="nav-menu-icon" aria-hidden />
          </button>
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
        <nav className="mobile-bottom-nav" aria-label="\u30e1\u30a4\u30f3\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3">
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
                className={`mobile-nav-link${active ? ' active' : ''}`}
              >
                <Icon className="mobile-nav-icon" />
                <span>{item.shortLabel}</span>
              </Link>
            )
          })}
        </nav>
        <UsageGuidePanel />
      </div>
    </div>
  )
}
