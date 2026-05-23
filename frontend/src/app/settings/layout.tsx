import { SettingsNav } from '@/components/SettingsNav'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="settings-layout">
      <div className="page-head">
        <h2>?? � BtoB SaaS</h2>
        <p>???????????API????????????????</p>
      </div>
      <SettingsNav />
      {children}
    </div>
  )
}

