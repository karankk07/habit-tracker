import { useState, useEffect, useCallback } from 'react';
import { createClientSupabase } from '@/lib/supabase';
import { Stats } from '@/types/habit';
import { calculateStreak, calculateWeeklyProgress } from '@/lib/utils/habit';
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns';

interface StatsWithTrends extends Stats {
  trends?: {
    [K in keyof Stats]?: number;
  };
}

export function useStats(userId: string | undefined) {
  const [stats, setStats] = useState<StatsWithTrends>({
    totalHabits: 0,
    completedToday: 0,
    weeklyProgress: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientSupabase();

  const calculateTrends = (
    currentStats: Stats,
    previousWeekLogs: any[],
    previousWeekHabits: number
  ) => {
    const trends: StatsWithTrends['trends'] = {};

    // Calculate previous week's stats
    const prevStats = {
      totalHabits: previousWeekHabits,
      completedToday: previousWeekLogs.filter(log => 
        log.date === format(subWeeks(new Date(), 1), 'yyyy-MM-dd') &&
        log.status === 'completed'
      ).length,
      weeklyProgress: calculateWeeklyProgress(previousWeekLogs, previousWeekHabits),
      currentStreak: calculateStreak(previousWeekLogs),
    };

    // Calculate percentage changes
    Object.keys(currentStats).forEach((key) => {
      const k = key as keyof Stats;
      const current = currentStats[k];
      const previous = prevStats[k];
      
      if (previous === 0) {
        trends[k] = current > 0 ? 100 : 0;
      } else {
        trends[k] = Math.round(((current - previous) / previous) * 100);
      }
    });

    return trends;
  };

  const fetchStats = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      // Get current week's data
      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

      // Get previous week's data
      const previousWeekStart = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });
      const previousWeekEnd = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });

      const [
        { data: habits, error: habitsError },
        { data: todayLogs, error: todayLogsError },
        { data: currentWeekLogs, error: currentWeekLogsError },
        { data: previousWeekLogs, error: previousWeekLogsError },
        { data: previousWeekHabits, error: previousWeekHabitsError }
      ] = await Promise.all([
        // Get total habits
        supabase.from('habits').select('id').eq('user_id', userId),
        
        // Get today's completed habits
        supabase
          .from('habit_logs')
          .select('*')
          .eq('user_id', userId)
          .eq('date', format(new Date(), 'yyyy-MM-dd'))
          .eq('status', 'completed'),
        
        // Get current week's logs
        supabase
          .from('habit_logs')
          .select('*')
          .eq('user_id', userId)
          .gte('date', format(currentWeekStart, 'yyyy-MM-dd'))
          .lte('date', format(currentWeekEnd, 'yyyy-MM-dd')),
        
        // Get previous week's logs
        supabase
          .from('habit_logs')
          .select('*')
          .eq('user_id', userId)
          .gte('date', format(previousWeekStart, 'yyyy-MM-dd'))
          .lte('date', format(previousWeekEnd, 'yyyy-MM-dd')),
        
        // Get previous week's habits count
        supabase
          .from('habits')
          .select('id')
          .eq('user_id', userId)
          .lte('created_at', format(previousWeekEnd, 'yyyy-MM-dd'))
      ]);

      if (habitsError) throw habitsError;
      if (todayLogsError) throw todayLogsError;
      if (currentWeekLogsError) throw currentWeekLogsError;
      if (previousWeekLogsError) throw previousWeekLogsError;
      if (previousWeekHabitsError) throw previousWeekHabitsError;

      const currentStats = {
        totalHabits: habits?.length || 0,
        completedToday: todayLogs?.length || 0,
        weeklyProgress: calculateWeeklyProgress(currentWeekLogs || [], habits?.length || 0),
        currentStreak: calculateStreak(currentWeekLogs || []),
      };

      const trends = calculateTrends(
        currentStats,
        previousWeekLogs || [],
        previousWeekHabits?.length || 0
      );

      setStats({ ...currentStats, trends });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [userId, fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
} 