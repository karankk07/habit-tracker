'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  suffix?: string;
  loading?: boolean;
  trend?: number;
}

export function StatCard({ title, value, icon, suffix = '', loading, trend }: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon}
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-2xl font-bold">
            {value}
            {suffix}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="ml-1 text-sm">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}