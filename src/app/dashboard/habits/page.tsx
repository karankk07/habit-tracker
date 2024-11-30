'use client';

import { useState, useEffect } from 'react';
import { createClientSupabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { HabitCard } from '@/components/habits/habit-card';
import { CreateHabitDialog } from '@/components/habits/create-habit-dialog';
import { useAuth } from '@/components/providers/auth-provider';
import { toast } from 'sonner';
import type { Database } from '@/types/database'
type Habit = Database['public']['Tables']['habits']['Row']

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { user } = useAuth();
  const supabase = createClientSupabase();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHabits(data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading habits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Habits</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Habit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <HabitCard 
            key={habit.id} 
            habit={habit}
            onUpdate={fetchHabits}
          />
        ))}
      </div>

      <CreateHabitDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onHabitCreated={fetchHabits}
      />
    </div>
  );
} 