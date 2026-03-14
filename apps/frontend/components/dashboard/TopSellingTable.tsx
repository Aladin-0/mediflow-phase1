'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/gst';

interface TopSellingItem {
  name: string;
  qty: number;
  revenue: number;
}

interface TopSellingTableProps {
  items: TopSellingItem[];
  totalSales: number;
  isLoading?: boolean;
}

export default function TopSellingTable({ items, totalSales, isLoading }: TopSellingTableProps) {
  const sumQty = items.reduce((acc, curr) => acc + curr.qty, 0);
  const sumRev = items.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Top Selling Today</span>
          {!isLoading && items.length > 0 && (
            <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {items.length} items
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-slate-50 uppercase tracking-wide border-y border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left font-medium w-[40%]">Product</th>
                <th className="px-5 py-3 text-center font-medium w-[20%]">Qty</th>
                <th className="px-5 py-3 text-right font-medium w-[25%]">Revenue</th>
                <th className="px-5 py-3 text-right font-medium w-[15%]">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3"><Skeleton className="h-4 w-3/4" /></td>
                    <td className="px-5 py-3 flex justify-center"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-5 py-3"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    <td className="px-5 py-3 flex justify-end"><Skeleton className="h-4 w-20" /></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground border-b border-slate-100 border-dashed">
                    No sales recorded yet today
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const sharePct = totalSales > 0 ? (item.revenue / totalSales) * 100 : 0;
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-900 truncate max-w-[180px] sm:max-w-[250px]">
                          {item.name}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-center text-slate-600">
                        {item.qty} {item.qty === 1 ? 'strip' : 'strips'}
                      </td>
                      <td className="px-5 py-3 text-right font-medium">
                        {formatCurrency(item.revenue)}
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <Progress value={sharePct} className="w-16 h-1.5 inline-block mr-2 [&>div]:bg-blue-500" />
                        <span className="text-xs text-muted-foreground inline-block w-8">
                          {Math.round(sharePct)}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
              {!isLoading && items.length > 0 && (
                <tr className="bg-slate-50 border-t border-slate-200">
                  <td className="px-5 py-3 font-semibold text-slate-900 text-left">Total Top 5</td>
                  <td className="px-5 py-3 font-semibold text-slate-900 text-center">{sumQty}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900 text-right">{formatCurrency(sumRev)}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900 text-right">
                    <span className="text-xs text-muted-foreground mr-6">
                      {Math.round((sumRev / (totalSales || 1)) * 100)}%
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
