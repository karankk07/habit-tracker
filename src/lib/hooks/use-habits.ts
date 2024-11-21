import useSWR from 'swr';
import { supabase } from '@/lib/supabase';

export function useHabits() {
  const { data, error, mutate } = useSWR('habits', async () => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  });

  return {
    habits: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
} 