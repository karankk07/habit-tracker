// src/app/layout.tsx
'use client';

import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/auth-provider'
import { HabitProvider } from '@/contexts/habit-context'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ErrorBoundary>
          <AuthProvider>
            <HabitProvider>
              {children}
            </HabitProvider>
          </AuthProvider>
        </ErrorBoundary>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}