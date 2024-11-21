import { useState, useEffect } from 'react';
import { createClientSupabase } from '@/lib/supabase';
import { HabitLog } from '@/types/habit';
import { calculateStreak } from '@/lib/utils/habit';
import { startOfWeek, endOfWeek } from 'date-fns';

export function useAchievements(userId: string | undefined) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabase();

  const calculatePerfectWeeks = (logs: HabitLog[], totalHabits: number): number => {
    if (totalHabits === 0) return 0;

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    
    const weekLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= weekStart && logDate <= weekEnd && log.status === 'completed';
    });

    return weekLogs.length >= totalHabits * 7 ? 1 : 0;
  };

  const calculateAchievements = async () => {
    if (!userId) return [];

    try {
      const [{ data: logs }, { data: habits }] = await Promise.all([
        supabase
          .from('habit_logs')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'completed')
          .returns<HabitLog[]>(),
        supabase
          .from('habits')
          .select('id')
          .eq('user_id', userId)
      ]);

      if (!logs || !habits) return [];

      const totalCompleted = logs.length;
      const currentStreak = calculateStreak(logs);
      const perfectWeeks = calculatePerfectWeeks(logs, habits.length);

      return ACHIEVEMENT_DEFINITIONS.map(achievement => {
        let progress = 0;
        let unlocked = false;

        switch (achievement.id) {
          case '1':
            progress = Math.min(totalCompleted, 1);
            unlocked = totalCompleted > 0;
            break;
          case '2':
            progress = totalCompleted;
            unlocked = totalCompleted >= 100;
            break;
          case '3':
            progress = perfectWeeks;
            unlocked = perfectWeeks > 0;
            break;
          case '4':
            progress = currentStreak;
            unlocked = currentStreak >= 30;
            break;
        }

        return {
          ...achievement,
          progress,
          unlocked,
        };
      });
    } catch (error) {
      console.error('Error calculating achievements:', error);
      return [];
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchAchievements = async () => {
        setLoading(true);
        const calculatedAchievements = await calculateAchievements();
        setAchievements(calculatedAchievements);
        setLoading(false);
      };

      fetchAchievements();
    }
  }, [userId]);

  return {
    achievements,
    loading,
    recalculate: calculateAchievements,
  };
} 