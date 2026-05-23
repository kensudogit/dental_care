'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/settings', label: '??', exact: true },
  { href: '/settings/organization', label: '??' },
  { href: '/settings/team', label: '???' },
  { href: '/settings/billing', label: '??????' },
  { href: '/settings/api-keys', label: 'API??' },
  { href: '/settings/audit', label: '????' },
] as const

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="settings-nav" aria-label="??">
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

