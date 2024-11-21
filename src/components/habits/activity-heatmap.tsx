'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { createClientSupabase } from '@/lib/supabase';
import { subDays, format, parseISO } from 'date-fns';
import { useAuth } from '@/components/providers/auth-provider';
import { cn } from '@/lib/utils';

interface ActivityHeatmapProps {
  habitId?: string;
}

interface DayActivity {
  date: string;
  count: number;
}

export function ActivityHeatmap({ habitId }: ActivityHeatmapProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<DayActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabase();

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user, habitId]);

  const fetchActivities = async () => {
    if (!user) return;

    try {
      const endDate = new Date();
      const startDate = subDays(endDate, 365);

      let query = supabase
        .from('habit_logs')
        .select('date, status')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'));

      if (habitId) {
        query = query.eq('habit_id', habitId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group by date and count
      const grouped = (data || []).reduce<Record<string, number>>((acc, log) => {
        acc[log.date] = (acc[log.date] || 0) + 1;
        return acc;
      }, {});

      const activities = Object.entries(grouped).map(([date, count]) => ({
        date,
        count,
      }));

      setActivities(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[repeat(53,1fr)] gap-1">
            {[...Array(371)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-sm bg-muted animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-muted/30';
    if (count <= 2) return 'bg-primary/30';
    if (count <= 4) return 'bg-primary/60';
    return 'bg-primary';
  };

  const days = Array.from({ length: 371 }, (_, i) => {
    const date = subDays(new Date(), 370 - i);
    const activity = activities.find(a => a.date === format(date, 'yyyy-MM-dd'));
    return {
      date,
      count: activity?.count || 0,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[repeat(53,1fr)] gap-1">
          {days.map((day, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-sm cursor-help transition-colors duration-200 hover:opacity-80",
                getIntensity(day.count)
              )}
              title={`${format(day.date, 'MMM d, yyyy')}: ${day.count} activities`}
              role="gridcell"
              aria-label={`${format(day.date, 'MMMM d, yyyy')}: ${day.count} activities`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 