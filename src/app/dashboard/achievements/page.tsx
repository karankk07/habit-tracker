'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Achievements } from '@/components/habits/achievements'

export default function AchievementsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Achievements</h1>
      <p className="text-muted-foreground">
        Track your progress and unlock achievements as you build better habits.
      </p>
      <Achievements />
    </div>
  )
} 