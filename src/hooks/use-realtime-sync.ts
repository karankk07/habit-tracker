import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Habit } from '@/types/habit';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeSync(userId?: string) {
  useEffect(() => {
    if (!userId) return;

    const subscription: RealtimeChannel = supabase
      .channel(`habits:user_id=eq.${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'habits',
        filter: `user_id=eq.${userId}`
      }, payload => {
        console.log('Change received!', payload);
        // Implement real-time updates if needed
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);
} 