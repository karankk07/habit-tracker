// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/auth-provider'
import { HabitProvider } from '@/contexts/habit-context'
import { ErrorBoundary } from '@/components/error-boundary'
import { ClientOnly } from '@/components/providers/client-only'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Habit Tracker',
    template: '%s | Habit Tracker'
  },
  description: 'Track and manage your daily habits',
  viewport: 'width=device-width, initial-scale=1',
  robots: process.env.NODE_ENV === 'production' ? 'all' : 'noindex,nofollow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ClientOnly>
          <ErrorBoundary>
            <AuthProvider>
              <HabitProvider>
                {children}
              </HabitProvider>
            </AuthProvider>
          </ErrorBoundary>
          <Toaster position="top-center" />
        </ClientOnly>
      </body>
    </html>
  )
}