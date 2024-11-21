'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { useHabitLogs } from '@/hooks/use-habit-logs'
import { HabitLog } from '@/types/habit'
import { startOfWeek, addDays, format } from 'date-fns'

interface WeeklyProgressProps {
  habit: {
    id: string
    frequency: number
  }
}

export function WeeklyProgress({ habit }: WeeklyProgressProps) {
  const { user } = useAuth()
  const { weeklyLogs, loading } = useHabitLogs(habit.id, user?.id)

  const getStatusForDay = (date: Date, logs: HabitLog[]) => {
    const log = logs.find(l => l.date === format(date, 'yyyy-MM-dd'))
    return log?.status || null
  }

  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  if (loading) {
    return (
      <div className="flex gap-1">
        {weekDays.map((_, i) => (
          <div
            key={i}
            className="h-6 w-6 rounded bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-1">
      {weekDays.map((day, i) => {
        const status = getStatusForDay(day, weeklyLogs)
        return (
          <div
            key={i}
            className={`h-6 w-6 rounded flex items-center justify-center text-xs ${
              status === 'completed' ? 'bg-primary text-primary-foreground' :
              status === 'partial' ? 'bg-primary/30 text-primary-foreground' :
              status === 'skipped' ? 'bg-muted text-muted-foreground' :
              'bg-muted/30 text-muted-foreground'
            }`}
            title={`${format(day, 'EEE')}: ${status || 'Not logged'}`}
          >
            {format(day, 'dd')}
          </div>
        )
      })}
    </div>
  )
} 