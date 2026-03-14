'use client';

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  onClick?: () => void;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  onClick,
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex justify-between items-start">
          <Skeleton className="w-11 h-11 rounded-full" />
        </div>
        <Skeleton className="w-24 h-7 mt-3" />
        <Skeleton className="w-32 h-4 mt-1" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-slate-200 p-5 transition-all',
        onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 active:scale-[0.98]' : ''
      )}
    >
      <div className="flex justify-between items-start">
        <div className={cn('w-11 h-11 rounded-full flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        
        {trend && (
          <div
            className={cn(
              'px-2 py-0.5 rounded-full flex gap-0.5 items-center text-xs font-medium',
              trend.direction === 'up' && 'bg-green-100 text-green-700',
              trend.direction === 'down' && 'bg-red-100 text-red-700',
              trend.direction === 'neutral' && 'bg-slate-100 text-slate-700'
            )}
            title={trend.label}
          >
            {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
            <span>
              {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
              {trend.value}%
            </span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-sm font-medium text-slate-500 mt-0.5">{title}</div>
      </div>

      {subtitle && (
        <div className="text-xs text-muted-foreground mt-2">{subtitle}</div>
      )}
    </div>
  );
}
