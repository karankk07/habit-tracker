'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarViewProps {
  habitId?: string; // Optional: to show calendar for specific habit
}

interface DayStatus {
  completed: number;
  partial: number;
  skipped: number;
  total: number;
}

export function CalendarView({ habitId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logs, setLogs] = useState<Record<string, DayStatus>>({});

  useEffect(() => {
    fetchMonthLogs();
  }, [currentDate, habitId]);

  const fetchMonthLogs = async () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    let query = supabase
      .from('habit_logs')
      .select('date, status')
      .gte('date', startOfMonth.toISOString().split('T')[0])
      .lte('date', endOfMonth.toISOString().split('T')[0]);

    if (habitId) {
      query = query.eq('habit_id', habitId);
    }

    const { data } = await query;

    // Group logs by date
    const logsByDate: Record<string, DayStatus> = {};
    data?.forEach(log => {
      if (!logsByDate[log.date]) {
        logsByDate[log.date] = { completed: 0, partial: 0, skipped: 0, total: 0 };
      }
      const statusKey = log.status as keyof DayStatus;
      logsByDate[log.date][statusKey]++;
      logsByDate[log.date].total++;
    });

    setLogs(logsByDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getStatusColor = (date: string) => {
    const status = logs[date];
    if (!status) return 'bg-gray-100 dark:bg-gray-800';
    
    const completionRate = status.completed / status.total;
    if (completionRate === 1) return 'bg-green-500';
    if (completionRate >= 0.5) return 'bg-green-300';
    if (completionRate > 0) return 'bg-yellow-300';
    if (status.skipped > 0) return 'bg-red-300';
    return 'bg-gray-100 dark:bg-gray-800';
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Calendar View</CardTitle>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium py-2">
              {day}
            </div>
          ))}
          {Array(startingDay).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {days.map(day => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              .toISOString()
              .split('T')[0];
            const dayStatus = logs[date];
            
            return (
              <div
                key={day}
                className={`aspect-square rounded-md ${getStatusColor(date)} 
                  flex items-center justify-center relative group`}
              >
                <span className="text-sm">{day}</span>
                {dayStatus && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                    bg-black text-white text-xs rounded p-2 hidden group-hover:block whitespace-nowrap">
                    Completed: {dayStatus.completed}<br />
                    Partial: {dayStatus.partial}<br />
                    Skipped: {dayStatus.skipped}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 