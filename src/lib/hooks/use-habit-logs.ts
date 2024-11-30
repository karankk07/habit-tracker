import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HabitLog } from '@/types/habit';
import { toast } from 'sonner';

export function useHabitLogs(habitId: string, userId?: string) {
  const [weeklyLogs, setWeeklyLogs] = useState<HabitLog[]>([]);
  const [todayLog, setTodayLog] = useState<HabitLog | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!userId) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: logs, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', habitId)
        .eq('user_id', userId);

      if (error) throw error;

      const todayLogData = logs.find(log => log.date === today) || null;
      setTodayLog(todayLogData);

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6); // Sunday

      const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startOfWeek && logDate <= endOfWeek && log.status === 'completed';
      });

      setWeeklyLogs(filteredLogs);
    } catch (error: any) {
      console.error('Error fetching habit logs:', error);
      toast.error('Failed to load habit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [habitId, userId]);

  return { weeklyLogs, todayLog, loading, refresh: fetchLogs };
}