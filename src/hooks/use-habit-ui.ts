import { useState } from 'react';
import { HabitLog } from '@/types/habit';

interface HabitUI {
  selectedDate: Date;
  selectedStatus: HabitLog['status'] | null;
}

export function useHabitUI() {
  const [ui, setUI] = useState<HabitUI>({
    selectedDate: new Date(),
    selectedStatus: null,
  });

  const setSelectedDate = (date: Date) => {
    setUI(prev => ({ ...prev, selectedDate: date }));
  };

  const setSelectedStatus = (status: HabitLog['status'] | null) => {
    setUI(prev => ({ ...prev, selectedStatus: status }));
  };

  return {
    ...ui,
    setSelectedDate,
    setSelectedStatus,
  };
} 