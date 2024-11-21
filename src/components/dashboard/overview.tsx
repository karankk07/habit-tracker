'use client'

import { CheckCircle, TrendingUp, Flame, Trophy } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useStats } from '@/hooks/use-stats'
import { Stats } from '@/types/habit'
import { StatCard } from '@/components/dashboard/stat-card'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  suffix?: string
  loading?: boolean
  trend?: number
}

const STAT_CARDS: (Omit<StatCardProps, 'value' | 'loading' | 'trend'> & { key: keyof Stats })[] = [
  {
    key: 'totalHabits',
    title: 'Total Habits',
    icon: <Trophy className="h-4 w-4" />,
  },
  {
    key: 'completedToday',
    title: 'Completed Today',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    key: 'weeklyProgress',
    title: 'Weekly Progress',
    icon: <TrendingUp className="h-4 w-4" />,
    suffix: '%',
  },
  {
    key: 'currentStreak',
    title: 'Current Streak',
    icon: <Flame className="h-4 w-4" />,
    suffix: ' days',
  },
]

export function DashboardOverview({ onRefresh }: { onRefresh?: () => void }) {
  const { user } = useAuth()
  const { stats, loading } = useStats(user?.id)

  return (
    <div 
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      role={loading ? 'status' : 'region'}
      aria-label={loading ? 'Loading dashboard statistics' : 'Dashboard Overview'}
    >
      {STAT_CARDS.map((card) => (
        <StatCard
          key={card.key}
          title={card.title}
          value={stats[card.key] as number}
          icon={card.icon}
          suffix={card.suffix}
          loading={loading}
          trend={stats.trends?.[card.key]}
        />
      ))}
    </div>
  )
}

export default DashboardOverview 