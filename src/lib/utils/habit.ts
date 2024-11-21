import { HabitLog } from '@/types/habit';
import { isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

export function calculateStreak(logs: HabitLog[]): number {
  if (!logs.length) return 0;

  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();

  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    if (log.status === 'completed' && 
        logDate.getTime() <= currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateWeeklyProgress(logs: HabitLog[], totalHabits: number): number {
  if (totalHabits === 0) return 0;

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const weeklyLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return isWithinInterval(logDate, { start: weekStart, end: weekEnd }) &&
           log.status === 'completed';
  });

  return Math.round((weeklyLogs.length / (totalHabits * 7)) * 100);
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isToday = (date: string): boolean => {
  return isSameDay(new Date(date), new Date());
}; 