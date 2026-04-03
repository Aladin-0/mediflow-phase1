'use client';

import { DashboardKPI } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Banknote, CreditCard, Smartphone, Tag } from 'lucide-react';

interface ProfitAnalysisCardProps {
    kpi: DashboardKPI | undefined;
    isLoading: boolean;
}

const fmt = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const pct = (num: number, denom: number) =>
    denom > 0 ? ((num / denom) * 100).toFixed(1) + '%' : '0%';

export default function ProfitAnalysisCard({ kpi, isLoading }: ProfitAnalysisCardProps) {
    const revenue = kpi?.totalSales ?? 0;
    const discount = kpi?.totalDiscount ?? 0;
    const gst = kpi?.totalGst ?? 0;
    const creditGiven = kpi?.creditGiven ?? 0;
    const cashCollected = kpi?.cashCollected ?? 0;
    const upiCollected = kpi?.upiCollected ?? 0;
    const cardCollected = kpi?.cardCollected ?? 0;
    const netRevenue = revenue - discount;
    const collected = cashCollected + upiCollected + cardCollected;
    const pending = creditGiven;

    const modes = [
        { label: 'Cash', amount: cashCollected, color: 'bg-emerald-500', icon: Banknote },
        { label: 'UPI', amount: upiCollected, color: 'bg-blue-500', icon: Smartphone },
        { label: 'Card', amount: cardCollected, color: 'bg-purple-500', icon: CreditCard },
        { label: 'Credit', amount: creditGiven, color: 'bg-orange-500', icon: Tag },
    ];

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Profit Analysis</CardTitle>
                    <CardDescription>Today's financial breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-8 bg-slate-100 rounded" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Profit Analysis</CardTitle>
                        <CardDescription>Today's financial breakdown</CardDescription>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${netRevenue >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {netRevenue >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {fmt(netRevenue)}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Revenue + Discount Row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3 border">
                        <p className="text-xs text-muted-foreground mb-0.5">Gross Revenue</p>
                        <p className="font-bold text-slate-900 text-sm">{fmt(revenue)}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                        <p className="text-xs text-red-600 mb-0.5">Discount Given</p>
                        <p className="font-bold text-red-700 text-sm">{fmt(discount)}</p>
                        <p className="text-[10px] text-red-400">{pct(discount, revenue)} of sales</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <p className="text-xs text-blue-600 mb-0.5">GST Collected</p>
                        <p className="font-bold text-blue-700 text-sm">{fmt(gst)}</p>
                        <p className="text-[10px] text-blue-400">{pct(gst, revenue)} of sales</p>
                    </div>
                </div>

                {/* Collection Breakdown */}
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Collection Breakdown</p>
                    <div className="space-y-2">
                        {modes.map(({ label, amount, color, icon: Icon }) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                                <div className="flex items-center gap-1.5 w-16 shrink-0">
                                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{label}</span>
                                </div>
                                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`${color} h-full rounded-full transition-all duration-500`}
                                        style={{ width: revenue > 0 ? `${Math.min(100, (amount / revenue) * 100)}%` : '0%' }}
                                    />
                                </div>
                                <span className="text-xs font-semibold text-slate-700 w-20 text-right tabular-nums">{fmt(amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Collected</p>
                        <p className="text-sm font-bold text-emerald-700">{fmt(collected)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Pending (Credit)</p>
                        <p className="text-sm font-bold text-orange-600">{fmt(pending)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Collection Rate</p>
                        <p className="text-sm font-bold text-blue-700">{pct(collected, revenue)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
