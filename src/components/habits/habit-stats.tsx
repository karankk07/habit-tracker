'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/providers/auth-provider';
import { useHabitLogs } from '@/hooks/use-habit-logs';
import { HabitLog } from '@/types/habit';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { startOfWeek, addDays, format } from 'date-fns';

interface HabitStatsProps {
  habit: {
    id: string;
    name: string;
    frequency: number;
  };
}

export function HabitStats({ habit }: HabitStatsProps) {
  const { user } = useAuth();
  const { weeklyLogs, loading } = useHabitLogs(habit.id, user?.id);

  const getCompletionRate = (logs: HabitLog[]) => {
    const total = logs.length;
    const completed = logs.filter(log => log.status === 'completed').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getWeeklyData = () => {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDate, i);
      const dayLogs = weeklyLogs.filter(
        log => log.date === format(date, 'yyyy-MM-dd')
      );
      return {
        day: format(date, 'EEE'),
        completed: dayLogs.filter(log => log.status === 'completed').length,
        partial: dayLogs.filter(log => log.status === 'partial').length,
        skipped: dayLogs.filter(log => log.status === 'skipped').length,
      };
    });
  };

  const calculateCurrentStreak = () => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, -i);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const logsForDay = weeklyLogs.filter(log => log.date === formattedDate && log.status === 'completed');
      if (logsForDay.length > 0) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle className="text-lg">Habit Statistics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]" />
      </Card>
    );
  }

  const completionRate = getCompletionRate(weeklyLogs);
  const weeklyData = getWeeklyData();
  const currentStreak = calculateCurrentStreak();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Habit Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Weekly Completion</p>
            <p className="text-2xl font-bold">{completionRate}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Target Frequency</p>
            <p className="text-2xl font-bold">{habit.frequency}x</p>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold">{currentStreak} days</p>
          </div>
        </motion.div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="partial"
                stroke="#eab308"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="skipped"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default HabitStats; 