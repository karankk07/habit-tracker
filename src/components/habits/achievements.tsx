'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, Star, Flame, Target, Award } from 'lucide-react';
import { createClientSupabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/auth-provider';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

const ACHIEVEMENT_TYPES = {
  STREAK: 'streak',
  TOTAL_COMPLETED: 'total_completed',
  PERFECT_WEEK: 'perfect_week',
  HABIT_MASTER: 'habit_master',
};

export function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabase();
  const { user } = useAuth();

  useEffect(() => {
    fetchAchievements();
  }, [user]);

  const fetchAchievements = async () => {
    if (!user) return;
    try {
      // Fetch user's habit logs
      const { data: logs, error: logsError } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (logsError) throw logsError;

      // Calculate streak
      const sortedLogs = logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      let currentStreak = 0;
      let maxStreak = 0;
      let previousDate: Date | null = null;

      sortedLogs.forEach(log => {
        const logDate = new Date(log.date);
        if (previousDate) {
          const diffTime = logDate.getTime() - previousDate.getTime();
          const diffDays = diffTime / (1000 * 3600 * 24);
          if (diffDays === 1) {
            currentStreak += 1;
          } else {
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
        previousDate = logDate;
      });

      // Total completed habits
      const totalCompleted = logs.length;

      // Define achievements
      const achievementsList: Achievement[] = [
        {
          id: '1',
          title: 'Getting Started',
          description: 'Complete your first habit',
          icon: 'trophy',
          unlocked: totalCompleted >= 1,
          progress: Math.min(totalCompleted, 1),
          target: 1,
        },
        {
          id: '2',
          title: 'Habit Master',
          description: 'Complete 100 habits',
          icon: 'star',
          unlocked: totalCompleted >= 100,
          progress: totalCompleted,
          target: 100,
        },
        {
          id: '3',
          title: 'Perfect Week',
          description: 'Complete all habits for a week',
          icon: 'flame',
          unlocked: false, // Implement perfect week logic if needed
          progress: 0,
          target: 1,
        },
        {
          id: '4',
          title: 'Consistency King',
          description: 'Maintain a 30-day streak',
          icon: 'target',
          unlocked: maxStreak >= 30,
          progress: maxStreak,
          target: 30,
        },
      ];

      setAchievements(achievementsList);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="w-6 h-6" />;
      case 'star':
        return <Star className="w-6 h-6" />;
      case 'flame':
        return <Flame className="w-6 h-6" />;
      case 'target':
        return <Target className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  if (loading) {
    return <div>Loading achievements...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {achievements.map((achievement) => (
        <Card 
          key={achievement.id}
          className={`${achievement.unlocked ? 'bg-primary/10' : ''}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {achievement.title}
            </CardTitle>
            <div className={`${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
              {getIcon(achievement.icon)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">
              {achievement.description}
            </p>
            <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all"
                style={{ 
                  width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` 
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {achievement.progress} / {achievement.target}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Achievements;