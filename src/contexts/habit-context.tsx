'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { createClientSupabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Database } from '@/types/database';

type Habit = Database['public']['Tables']['habits']['Row'];

export interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  error: Error | null;
  fetchHabits: () => Promise<void>;
  createHabit: (habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateHabit: (id: string, habit: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  refreshAll: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientSupabase();

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHabits(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch habits'));
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return (
    <HabitContext.Provider
      value={{
        habits,
        loading,
        error,
        fetchHabits,
        createHabit: async () => {},
        updateHabit: async () => {},
        deleteHabit: async () => {},
        refreshAll: fetchHabits,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabitContext() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabitContext must be used within a HabitProvider');
  }
  return context;
} 