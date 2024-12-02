'use client'

import { useState, useEffect } from 'react'
import { DashboardOverview } from './overview'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { HabitCard } from '@/components/habits/habit-card'
import { useHabitContext } from '@/contexts/habit-context'
import { LoadingState } from '@/components/ui/loading-state'
import { CreateHabitDialog } from '@/components/habits/create-habit-dialog'
import { ActivityHeatmap } from '@/components/habits/activity-heatmap'

export function DashboardClient() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { habits, loading, fetchHabits } = useHabitContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (loading) {
    return <LoadingState text="Loading habits..." />
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6">
        <section>
          <DashboardOverview onRefresh={fetchHabits} />
        </section>
        
        <section>
          <ActivityHeatmap />
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Your Habits</h2>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onUpdate={fetchHabits}
              />
            ))}
          </div>
        </section>
      </div>

      <CreateHabitDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onHabitCreated={fetchHabits}
      />
    </div>
  )
} 