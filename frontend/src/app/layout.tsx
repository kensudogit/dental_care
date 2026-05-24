import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { AppShell } from '@/components/AppShell'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'DentalCare DX | 歯科医療プラットフォーム',
  description: 'GraphQL · Go + Next.js 歯科医療DXプラットフォーム',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={jakarta.variable}>
      <body className={jakarta.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}

