'use client';

import { useEffect, useState } from 'react';
import { DashboardOverview } from '@/components/dashboard/overview';
import { HabitCard } from '@/components/habits/habit-card';
import { Achievements } from '@/components/habits/achievements';
import { StreakCalendar } from '@/components/habits/streak-calendar';
import { HabitStats } from '@/components/habits/habit-stats';
import { useAuth } from '@/components/providers/auth-provider';
import { Habit, HabitLog } from '@/types/habit';
import { createClientSupabase } from '@/lib/supabase';
import { useRealtimeSync } from '@/hooks/use-realtime-sync';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CreateHabitDialog } from '@/components/habits/create-habit-dialog';

interface HabitWithLogs extends Habit {
  logs?: HabitLog[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<HabitWithLogs[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithLogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const supabase = createClientSupabase();

  useRealtimeSync(user?.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchHabits = async () => {
    if (!user) return;

    try {
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select(`
          *,
          logs:habit_logs(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;
      
      setHabits(habits || []);
      if (habits?.length > 0 && !selectedHabit) {
        setSelectedHabit(habits[0]);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto p-6 pb-24">
        <div className="space-y-6">
          {/* Overview Stats */}
          <section>
            <DashboardOverview onRefresh={fetchHabits}/>
          </section>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-8">
              {/* Habits List */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold tracking-tight">Your Habits</h2>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Habit
                  </Button>
                </div>
                <div className="grid gap-4">
                  {habits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onUpdate={fetchHabits}
                    />
                  ))}
                  {habits.length === 0 && !loading && (
                    <Card className="p-8 text-center">
                      <div className="mb-4 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No habits yet</h3>
                        <p className="text-sm">Start by creating your first habit to track.</p>
                      </div>
                      <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Habit
                      </Button>
                    </Card>
                  )}
                </div>
              </section>

              {/* Selected Habit Stats */}
              {selectedHabit && (
                <section>
                  <HabitStats habit={selectedHabit} />
                </section>
              )}
            </div>

            <div className="space-y-8">
              {/* Streak Calendar */}
              <section>
                <StreakCalendar
                  logs={habits.flatMap(habit => 
                    habit.logs?.filter(log => log.status === 'completed') || []
                  )}
                />
              </section>

              {/* Achievements */}
              <section>
                <Achievements />
              </section>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background p-4">
          <Tabs defaultValue="habits" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="habits">Habits</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="habits" className="mt-4 space-y-4">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onUpdate={fetchHabits}
                />
              ))}
            </TabsContent>
            <TabsContent value="stats" className="mt-4 space-y-4">
              <StreakCalendar
                logs={habits.flatMap(habit => 
                  habit.logs?.filter(log => log.status === 'completed') || []
                )}
              />
              <Achievements />
            </TabsContent>
          </Tabs>
        </div>

        <CreateHabitDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onHabitCreated={fetchHabits}
        />
      </div>
    </div>
  );
} 