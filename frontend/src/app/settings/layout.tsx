import { SettingsNav } from '@/components/SettingsNav'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="settings-layout">
      <div className="page-head">
        <h2>Settings / BtoB SaaS</h2>
        <p>Organization, team, billing, API keys, and audit log.</p>
      </div>
      <SettingsNav />
      {children}
    </div>
  )
}
