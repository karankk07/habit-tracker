'use client';

import { useState } from 'react';
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
import { useAuth } from '@/components/providers/auth-provider';
import { toast } from 'sonner';

interface CreateHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitCreated: () => void;
}

export function CreateHabitDialog({
  open,
  onOpenChange,
  onHabitCreated,
}: CreateHabitDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('1');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const supabase = createClientSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('habits').insert({
        name,
        description,
        frequency: parseInt(frequency),
        user_id: user.id,
      });

      if (error) throw error;

      toast.success('Habit created successfully');
      onHabitCreated();
      onOpenChange(false);
      setName('');
      setDescription('');
      setFrequency('1');
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
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
              {loading ? 'Creating...' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}