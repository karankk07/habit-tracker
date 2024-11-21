import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HabitLog } from '@/types/habit';
import { toast } from 'sonner';

export function useHabitStore(userId?: string) {
  const [loading, setLoading] = useState(false);

  const logHabitProgress = async (habitId: string, status: HabitLog['status']): Promise<HabitLog | null> => {
    if (!userId) {
      toast.error('User not authenticated');
      return null;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('habit_logs')
        .upsert([{
          habit_id: habitId,
          user_id: userId,
          date: today,
          status,
        }], { onConflict: 'habit_id,user_id,date' })
        .select()
        .single();

      if (error) throw error;

      toast.success('Progress updated');
      return data;
    } catch (error: any) {
      console.error('Error logging progress:', error);
      toast.error(error.message || 'Failed to log progress');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteHabit = async (habitId: string): Promise<void> => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Habit deleted');
    } catch (error: any) {
      console.error('Error deleting habit:', error);
      toast.error(error.message || 'Failed to delete habit');
    } finally {
      setLoading(false);
    }
  };

  return { loading, logHabitProgress, deleteHabit };
} 