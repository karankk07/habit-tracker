import { startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { HabitLog } from '@/types/habit';

export const calculateStreak = (logs: HabitLog[]): number => {
  if (!logs.length) return 0;

  const sortedLogs = logs.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  
  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    if (isSameDay(currentDate, logDate) || 
        currentDate.getTime() - logDate.getTime() === 86400000) {
      streak++;
      currentDate = logDate;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateWeeklyProgress = (
  logs: HabitLog[], 
  totalHabits: number
): number => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
  
  const weekLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= startDate && logDate <= endDate;
  });

  const completedLogs = weekLogs.filter(log => log.status === 'completed');
  const weeklyTotal = totalHabits * 7;
  
  return weeklyTotal > 0 
    ? Math.round((completedLogs.length / weeklyTotal) * 100) 
    : 0;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isToday = (date: string): boolean => {
  return isSameDay(new Date(date), new Date());
}; 