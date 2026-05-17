// app/layout.tsx — Javari Cards
import type { Metadata } from 'next'
import './globals.css'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Javari Cards | Javari by CR AudioViz AI',
  description: 'Trading card tracker',
}
import AppShell from '@/components/AppShell'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body style={{ margin: 0, padding: 0 }}><AppShell appName="Javari Cards" appColor="#f59e0b" appEmoji="🃏" appDesc="Trading card tracker">{children}</AppShell></body></html>)
}
