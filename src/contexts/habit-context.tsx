'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useStats } from '@/hooks/use-stats';
import { useAchievements } from '@/hooks/use-achievements';
import { useAuth } from '@/components/providers/auth-provider';

interface HabitContextType {
  refreshAll: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshAchievements: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { refresh: refreshStats } = useStats(user?.id);
  const { recalculate: refreshAchievements } = useAchievements(user?.id);

  const refreshAll = useCallback(async () => {
    const [stats, achievements] = await Promise.all([
      refreshStats(),
      refreshAchievements(),
    ]);
    return;
  }, [refreshStats, refreshAchievements]);

  return (
    <HabitContext.Provider value={{
      refreshAll,
      refreshStats: async () => { await refreshStats(); },
      refreshAchievements: async () => { await refreshAchievements(); return; },
    }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabitContext() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabitContext must be used within a HabitProvider');
  }
  return context;
} 