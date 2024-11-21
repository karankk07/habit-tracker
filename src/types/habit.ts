export interface Habit {
  id: string;
  name: string;
  description: string | null;
  frequency: number;
  user_id: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  status: 'completed' | 'partial' | 'skipped';
}

export interface Stats {
  totalHabits: number;
  completedToday: number;
  weeklyProgress: number;
  currentStreak: number;
  trends?: {
    [key in keyof Stats]?: number;
  }
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  unlocked?: boolean;
  progress?: number;
} 