import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg hidden sm:block" />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
            <Skeleton className="w-11 h-11 rounded-full" />
            <Skeleton className="w-24 h-7 mt-3" />
            <Skeleton className="w-32 h-4 mt-2" />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 h-[320px] flex flex-col">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-6" />
          <div className="flex-1 flex items-end gap-2">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="flex-1 bg-slate-100 rounded-t-sm" style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-6 h-[320px] flex flex-col items-center justify-center">
            <Skeleton className="h-6 w-40 mb-2 self-start" />
            <Skeleton className="h-4 w-32 mb-8 self-start" />
            <Skeleton className="w-40 h-40 rounded-full" />
        </div>
      </div>

      {/* Table & Leaderboard Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-0 h-[400px]">
          <div className="p-6 pb-4 border-b border-slate-100">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
               <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-6 h-[400px]">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
               <div key={i} className="flex gap-3 items-center">
                 <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                 <div className="space-y-2 flex-1">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-3 w-1/2" />
                 </div>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border-l-[4px] border border-slate-200 p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1">
                <Skeleton className="w-32 h-5 mb-2" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
