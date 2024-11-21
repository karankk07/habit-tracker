'use client'

import { AuthProvider } from '@/components/providers/auth-provider'

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
} 