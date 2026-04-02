'use client';

import { useDashboardKPI, useDashboardAlerts } from '@/hooks/useDashboard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCardsRow from '@/components/dashboard/StatCardsRow';
import PaymentPieChart from '@/components/dashboard/PaymentPieChart';
import TopSellingTable from '@/components/dashboard/TopSellingTable';
import StaffLeaderboard from '@/components/dashboard/StaffLeaderboard';
import AlertsRow from '@/components/dashboard/AlertsRow';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import dynamic from 'next/dynamic';

const HOURLY_HEIGHTS = ['45%', '65%', '55%', '70%', '50%', '60%', '52%', '68%', '48%', '72%'];

const HourlySalesChart = dynamic(() => import('@/components/dashboard/HourlySalesChart'), {
  ssr: false,
  loading: () => (
    <div className="flex gap-2 items-end h-60 w-full pt-4 animate-pulse">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex-1 bg-slate-100 rounded-t-sm" style={{ height: HOURLY_HEIGHTS[i % HOURLY_HEIGHTS.length] }} />
      ))}
    </div>
  )
});

export default function DashboardPage() {
  const { data: kpi, isLoading: kpiLoading, isFetching, refetch } = useDashboardKPI();
  const { data: alerts, isLoading: alertsLoading } = useDashboardAlerts();

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Greeting + date + refresh */}
      <DashboardHeader isFetching={isFetching} onRefresh={refetch} />

      {/* KPI Cards */}
      <StatCardsRow kpi={kpi} isLoading={kpiLoading} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Hourly Sales</CardTitle>
              <CardDescription>Today&apos;s billing activity</CardDescription>
            </CardHeader>
            <CardContent>
              <HourlySalesChart
                data={kpi?.hourlySales ?? []}
                isLoading={kpiLoading}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Payment Breakdown</CardTitle>
              <CardDescription>Today&apos;s collection</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentPieChart kpi={kpi} isLoading={kpiLoading} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Table + Leaderboard row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TopSellingTable
            items={kpi?.topSellingItems ?? []}
            totalSales={kpi?.totalSales ?? 0}
            isLoading={kpiLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <StaffLeaderboard
            leaderboard={(kpi?.staffLeaderboard ?? []).map(staff => ({
              id: staff.id ?? staff.staffId ?? '',
              name: staff.name,
              role: staff.role ?? 'billing_staff',
              totalSales: staff.totalSales,
              billsCount: staff.billsCount
            }))}
            isLoading={kpiLoading}
          />
        </div>
      </div>

      {/* Alerts row */}
      <AlertsRow
        alerts={alerts}
        isLoading={alertsLoading}
      />

    </div>
  );
}
