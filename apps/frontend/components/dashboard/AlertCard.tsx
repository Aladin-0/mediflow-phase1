'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export interface AlertItem {
  label: string;
  sublabel: string;
  badge: React.ReactNode;
}

export interface AlertCardProps {
  title: string;
  count: number;
  description: string;
  borderColor: string;
  icon: LucideIcon;
  iconColor: string;
  items?: AlertItem[];
  ctaLabel: string;
  ctaHref: string;
  isEmpty: boolean;
  emptyMessage: string;
  isLoading?: boolean;
}

export function AlertCard({
  title,
  count,
  description,
  borderColor,
  icon: Icon,
  iconColor,
  items = [],
  ctaLabel,
  ctaHref,
  isEmpty,
  emptyMessage,
  isLoading,
}: AlertCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className={cn('bg-white rounded-xl border-l-[4px] border p-4 shadow-sm', borderColor)}>
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1">
            <Skeleton className="w-24 h-5 mb-2" />
            <Skeleton className="w-48 h-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl border border-l-[4px] p-4 shadow-sm transition-all', borderColor)}>
      <div 
        className={cn('flex items-start gap-3', !isEmpty && 'cursor-pointer select-none')} 
        onClick={() => !isEmpty && setIsExpanded(!isExpanded)}
      >
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 shrink-0')}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
            {!isEmpty && (
              <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          <p className={cn('mt-0.5 text-sm', isEmpty ? 'text-green-600 font-medium' : 'text-slate-600 font-medium')}>
            {isEmpty ? emptyMessage : description.replace('{count}', count.toString())}
          </p>
        </div>
      </div>

      {/* Expanded List Items */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded && !isEmpty ? 'max-h-[400px] mt-4 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded px-2 -mx-2">
              <div className="min-w-0 flex-1 pr-3">
                <p className="font-medium text-slate-900 truncate">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate leading-snug">{item.sublabel}</p>
              </div>
              <div className="shrink-0">{item.badge}</div>
            </div>
          ))}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(ctaHref);
            }}
            className="text-sm font-medium text-primary hover:text-blue-700 hover:underline transition-all mt-2 self-start flex gap-1 items-center"
          >
            {ctaLabel} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
