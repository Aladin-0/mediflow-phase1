'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown, TrendingUp, AlertCircle, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatINR = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface Props {
    totalPayable: number;
    overduePayable: number;
    totalReceivable: number;
    isLoading?: boolean;
}

export function AccountsSummaryCards({ totalPayable, overduePayable, totalReceivable, isLoading }: Props) {
    const netPosition = totalReceivable - totalPayable;

    const cards = [
        {
            label: 'Total Payable',
            value: totalPayable,
            subtext: 'You owe to distributors',
            icon: TrendingDown,
            color: totalPayable > 0 ? 'text-red-600' : 'text-emerald-600',
            bg: totalPayable > 0 ? 'bg-red-50' : 'bg-emerald-50',
            iconColor: totalPayable > 0 ? 'text-red-500' : 'text-emerald-500',
        },
        {
            label: 'Overdue Payable',
            value: overduePayable,
            subtext: 'Past due date',
            icon: AlertCircle,
            color: overduePayable > 0 ? 'text-red-700' : 'text-slate-500',
            bg: overduePayable > 0 ? 'bg-red-50' : 'bg-slate-50',
            iconColor: overduePayable > 0 ? 'text-red-500' : 'text-slate-400',
        },
        {
            label: 'Total Receivable',
            value: totalReceivable,
            subtext: 'Customers owe you',
            icon: TrendingUp,
            color: totalReceivable > 0 ? 'text-emerald-600' : 'text-slate-500',
            bg: 'bg-emerald-50',
            iconColor: 'text-emerald-500',
        },
        {
            label: 'Net Position',
            value: Math.abs(netPosition),
            subtext: netPosition >= 0 ? 'Net receivable' : 'Net payable',
            icon: ArrowLeftRight,
            color: netPosition >= 0 ? 'text-emerald-600' : 'text-red-600',
            bg: netPosition >= 0 ? 'bg-emerald-50' : 'bg-red-50',
            iconColor: netPosition >= 0 ? 'text-emerald-500' : 'text-red-500',
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-5 space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-7 w-20" />
                            <Skeleton className="h-3 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((c) => {
                const Icon = c.icon;
                return (
                    <Card key={c.label}>
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm text-muted-foreground">{c.label}</p>
                                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', c.bg)}>
                                    <Icon className={cn('h-4 w-4', c.iconColor)} />
                                </div>
                            </div>
                            <p className={cn('mt-2 text-2xl font-bold tabular-nums', c.color)}>
                                {formatINR(c.value)}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{c.subtext}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
