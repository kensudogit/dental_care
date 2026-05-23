'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs: { href: string; label: string; exact?: boolean }[] = [
  { href: '/settings', label: 'Overview', exact: true },
  { href: '/settings/organization', label: 'Organization' },
  { href: '/settings/team', label: 'Team' },
  { href: '/settings/billing', label: 'Billing' },
  { href: '/settings/api-keys', label: 'API Keys' },
  { href: '/settings/audit', label: 'Audit' },
]

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="settings-nav" aria-label="Settings">
      {tabs.map((tab) => {
        const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
        return (
          <Link key={tab.href} href={tab.href} className={`settings-tab${active ? ' active' : ''}`}>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
