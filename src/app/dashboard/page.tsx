// app/dashboard/page.tsx
"use client"

import { useAuth } from '@/components/providers/auth-provider'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardOverview } from '@/components/dashboard/overview'
import { HabitProgress } from '@/components/habits/habit-progress'
import { ActivityHeatmap } from '@/components/habits/activity-heatmap'
import { createClientSupabase } from '@/lib/supabase'
import { HabitCard } from '@/components/habits/habit-card'

interface Habit {
  id: string
  name: string
  description: string | null
  frequency: number
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loadingHabits, setLoadingHabits] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const supabase = createClientSupabase()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    } else if (user) {
      fetchHabits()
    }
  }, [loading, user, router])

  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setHabits(data || [])
      setRefreshKey(prev => prev + 1)
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoadingHabits(false)
    }
  }

  if (loading || loadingHabits) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome back, {user?.email}!</h1>
      
      <DashboardOverview key={`overview-${refreshKey}`} />
      <ActivityHeatmap key={`heatmap-${refreshKey}`} />

      {/* Recent Habits */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Habits</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {habits.map(habit => (
            <HabitCard 
              key={`${habit.id}-${refreshKey}`}
              habit={habit}
              onUpdate={fetchHabits}
            />
          ))}
        </div>
      </div>
    </div>
  )
}