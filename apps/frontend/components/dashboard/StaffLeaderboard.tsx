'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { formatCurrency } from '@/lib/gst';
import { StaffRole } from '@/types';

interface LeaderboardStaff {
  id: string;
  name: string;
  role: string | StaffRole; // Flexible
  totalSales: number;
  billsCount: number;
}

interface StaffLeaderboardProps {
  leaderboard: LeaderboardStaff[];
  isLoading?: boolean;
}

export default function StaffLeaderboard({ leaderboard, isLoading }: StaffLeaderboardProps) {
  const router = useRouter();

  const getInitials = (name?: string) => name ? name.substring(0, 2).toUpperCase() : 'U';

  const getRankBadge = (idx: number) => {
    switch (idx) {
      case 0:
        return 'bg-amber-400 text-white border-amber-500 border'; // Gold
      case 1:
        return 'bg-slate-200 text-slate-700 border-slate-300 border'; // Silver
      case 2:
        return 'bg-amber-700/20 text-amber-900 border-amber-700/30 border'; // Bronze
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Staff Leaderboard</CardTitle>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Today</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-4 pb-2">
        <div className="flex-1 space-y-0 text-sm">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
                <Skeleton className="w-7 h-7 rounded-full" />
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-12 ml-auto" />
                  <Skeleton className="h-3 w-16 ml-auto" />
                </div>
              </div>
            ))
          ) : leaderboard.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border-2 border-dashed border-slate-100 rounded-lg">
              No billing activity today
            </div>
          ) : (
            leaderboard.slice(0, 3).map((staff, idx) => (
              <div key={staff.id} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getRankBadge(idx)}`}>
                  {idx + 1}
                </div>
                
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
                    {getInitials(staff.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{staff.name}</p>
                  <div className="mt-0.5">
                    <RoleBadge role={staff.role as StaffRole} size="sm" />
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-semibold text-slate-900">{staff.billsCount} bills</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatCurrency(staff.totalSales)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 mt-auto text-center border-t border-slate-50">
          <button
            className="text-sm font-medium text-primary hover:text-blue-700 hover:underline transition-all"
            onClick={() => router.push('/dashboard/staff')}
          >
            View all staff &rarr;
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
