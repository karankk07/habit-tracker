import { Suspense } from 'react'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { LoadingState } from '@/components/ui/loading-state'

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingState text="Loading dashboard..." />}>
      <DashboardClient />
    </Suspense>
  )
} 