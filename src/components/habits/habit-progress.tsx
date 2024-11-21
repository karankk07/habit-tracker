'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, MinusCircle } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { useHabitStore } from '@/hooks/use-habit-store';
import { useHabitLogs } from '@/hooks/use-habit-logs';
import { HabitLog } from '@/types/habit';
import { useHabitContext } from '@/contexts/habit-context';

interface HabitProgressProps {
  habit: {
    id: string;
    name: string;
    description: string | null;
    frequency: number;
  };
  onUpdate: () => void;
  compact?: boolean;
}

const PROGRESS_OPTIONS = {
  COMPLETED: 'completed',
  PARTIAL: 'partial',
  SKIPPED: 'skipped',
} as const;

type ProgressStatus = typeof PROGRESS_OPTIONS[keyof typeof PROGRESS_OPTIONS];

function ProgressButton({ 
  status, 
  currentStatus, 
  onClick, 
  disabled 
}: { 
  status: ProgressStatus;
  currentStatus: ProgressStatus | null;
  onClick: () => void;
  disabled: boolean;
}) {
  const getIcon = () => {
    switch (status) {
      case PROGRESS_OPTIONS.COMPLETED:
        return <CheckCircle className="w-4 h-4 mr-2" />;
      case PROGRESS_OPTIONS.PARTIAL:
        return <Circle className="w-4 h-4 mr-2" />;
      case PROGRESS_OPTIONS.SKIPPED:
        return <MinusCircle className="w-4 h-4 mr-2" />;
    }
  };

  const getLabel = () => {
    switch (status) {
      case PROGRESS_OPTIONS.COMPLETED:
        return 'Complete';
      case PROGRESS_OPTIONS.PARTIAL:
        return 'Partial';
      case PROGRESS_OPTIONS.SKIPPED:
        return 'Skip';
    }
  };

  return (
    <Button
      variant={currentStatus === status ? 'default' : 'outline'}
      onClick={onClick}
      disabled={disabled}
      className="flex-1"
      aria-pressed={currentStatus === status}
    >
      {getIcon()}
      {getLabel()}
    </Button>
  );
}

export function HabitProgress({ habit, onUpdate, compact = false }: HabitProgressProps) {
  const { user } = useAuth();
  const { loading: storeLoading, logHabitProgress } = useHabitStore(user?.id);
  const { todayLog, loading: logsLoading, refresh: refreshLogs } = useHabitLogs(habit.id, user?.id);
  const { refreshAll } = useHabitContext();

  const handleLogProgress = async (status: HabitLog['status']) => {
    const result = await logHabitProgress(habit.id, status);

    if (result !== null) {
      await Promise.all([
        refreshLogs(),
        refreshAll(),
      ]);
      onUpdate();
    }
  };

  const loading = storeLoading || logsLoading;

  if (compact) {
    return (
      <div 
        className="flex gap-2"
        role="group"
        aria-label="Track habit progress"
      >
        {(Object.values(PROGRESS_OPTIONS) as ProgressStatus[]).map((status) => (
          <ProgressButton
            key={status}
            status={status}
            currentStatus={todayLog?.status as ProgressStatus}
            onClick={() => handleLogProgress(status)}
            disabled={loading}
          />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-base">{habit.name}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-3">
        <div 
          className="flex gap-2"
          role="group"
          aria-label="Track habit progress"
        >
          {(Object.values(PROGRESS_OPTIONS) as ProgressStatus[]).map((status) => (
            <ProgressButton
              key={status}
              status={status}
              currentStatus={todayLog?.status as ProgressStatus}
              onClick={() => handleLogProgress(status)}
              disabled={loading}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default HabitProgress; 