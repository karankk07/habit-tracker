'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HabitLog } from '@/types/habit';
import { startOfYear, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StreakCalendarProps {
  logs: HabitLog[];
  loading?: boolean;
}

export function StreakCalendar({ logs, loading = false }: StreakCalendarProps) {
  const startDate = startOfYear(new Date());
  const days = eachDayOfInterval({
    start: startDate,
    end: new Date(),
  });

  const getStatusForDay = (date: Date) => {
    return logs.find(log => isSameDay(new Date(log.date), date))?.status || null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[repeat(53,1fr)] gap-1">
            {[...Array(371)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-sm bg-muted animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[repeat(53,1fr)] gap-1">
          {days.map((day, i) => {
            const status = getStatusForDay(day);
            return (
              <motion.div
                key={day.toISOString()}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.001 }}
                className={cn(
                  "w-2 h-2 rounded-sm cursor-help transition-colors duration-200 hover:opacity-80",
                  status === 'completed' ? 'bg-primary' :
                  status === 'partial' ? 'bg-primary/30' :
                  status === 'skipped' ? 'bg-muted' :
                  'bg-muted/30'
                )}
                title={`${format(day, 'MMM d, yyyy')}: ${status || 'No activity'}`}
                role="gridcell"
                aria-label={`${format(day, 'MMMM d, yyyy')}: ${status || 'No activity'}`}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 