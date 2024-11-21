'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClientSupabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface EditHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: {
    id: string;
    name: string;
    description: string | null;
    frequency: number;
  };
  onHabitUpdated: () => void;
}

export function EditHabitDialog({
  open,
  onOpenChange,
  habit,
  onHabitUpdated,
}: EditHabitDialogProps) {
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description || '');
  const [frequency, setFrequency] = useState(habit.frequency.toString());
  const [loading, setLoading] = useState(false);
  const supabase = createClientSupabase();

  useEffect(() => {
    setName(habit.name);
    setDescription(habit.description || '');
    setFrequency(habit.frequency.toString());
  }, [habit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('habits')
        .update({
          name,
          description,
          frequency: parseInt(frequency),
        })
        .eq('id', habit.id);

      if (error) throw error;

      toast.success('Habit updated successfully');
      onHabitUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter habit name"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter habit description"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Weekly Frequency</label>
            <Input
              type="number"
              min="1"
              max="7"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 