'use client';

import { RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';

interface DashboardHeaderProps {
  isFetching?: boolean;
  onRefresh?: () => void;
}

export default function DashboardHeader({ isFetching, onRefresh }: DashboardHeaderProps) {
  const { user, outlet } = useAuthStore();
  const { selectedOutletId } = useSettingsStore();
  const today = format(new Date(), 'dd MMM yyyy');
  const now = new Date();
  
  // Decide outlet name
  const outletName = selectedOutletId && selectedOutletId !== outlet?.id
    ? 'Selected Branch' // Can be enhanced later to fetch name
    : outlet?.name ?? 'Main Branch';

  const hour = now.getHours();
  // Time-aware greeting
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {greeting}, {firstName} <span className="inline-block origin-bottom hover:animate-shake">👋</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1 font-medium">
          {outletName} — {format(now, 'EEEE')}, {today}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-500' : ''}`} />
          {isFetching ? 'Updating...' : 'Refresh'}
        </button>

        <div className="bg-slate-100/80 text-slate-700 text-sm px-3 py-1.5 rounded-lg font-medium border border-slate-200/60 hidden sm:block">
          {today}
        </div>
      </div>
    </div>
  );
}
