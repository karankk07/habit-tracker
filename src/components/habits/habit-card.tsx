'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClientSupabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import { EditHabitDialog } from './edit-habit-dialog';
import { HabitProgress } from './habit-progress';
import { WeeklyProgress } from './weekly-progress';
import { CalendarView } from './calendar-view';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import type { Database } from '@/types/database'

type Habit = Database['public']['Tables']['habits']['Row']

interface HabitCardProps {
  habit: Habit
  onUpdate: () => Promise<void>
}

export function HabitCard({ habit, onUpdate }: HabitCardProps) {
  const [loading, setLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const supabase = createClientSupabase();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habit.id);

      if (error) throw error;
      toast.success('Habit deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="max-w-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-semibold">{habit.name}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCalendar(!showCalendar)}
              disabled={loading}
              aria-label="Toggle Calendar View"
              className="h-8 w-8 p-0"
            >
              <Calendar className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              disabled={loading}
              aria-label="Edit Habit"
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading}
              aria-label="Delete Habit"
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {habit.description || 'No description'}
          </p>
          <p className="text-sm">
            Goal: {habit.frequency} times per week
          </p>
          
          {/* Daily Progress */}
          <div className="scale-90 origin-left">
            <HabitProgress habit={habit} onUpdate={onUpdate} compact />
          </div>
          
          {/* Weekly Progress */}
          <WeeklyProgress habit={habit} />
          
          {/* Monthly Calendar */}
          {showCalendar && (
            <div className="mt-4">
              <CalendarView habitId={habit.id} />
            </div>
          )}
        </CardContent>
      </Card>

      <EditHabitDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        habit={habit}
        onHabitUpdated={onUpdate}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="hidden" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this habit? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default HabitCard;
