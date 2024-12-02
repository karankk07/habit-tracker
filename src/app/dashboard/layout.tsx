'use client'

import { Header } from '@/components/layouts/header'
import { Navigation } from '@/components/layouts/navigation'
import { ClientOnly } from '@/components/providers/client-only'

function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <Navigation />
      <main className="md:pl-64 pt-16">
        <div className="container mx-auto p-6 pb-24">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientOnly>
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </ClientOnly>
  )
} 