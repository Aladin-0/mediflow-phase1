'use client';

import { format } from 'date-fns';
import { Banknote, Smartphone, FileText, Building2, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentEntry } from '@/types';
import { cn } from '@/lib/utils';

const formatINR = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const MODE_CONFIG: Record<string, { label: string; icon: any; classes: string }> = {
    cash:         { label: 'Cash',          icon: Banknote,   classes: 'bg-emerald-50 text-emerald-700' },
    upi:          { label: 'UPI',           icon: Smartphone, classes: 'bg-blue-50 text-blue-700' },
    cheque:       { label: 'Cheque',        icon: FileText,   classes: 'bg-amber-50 text-amber-700' },
    bank_transfer:{ label: 'Bank Transfer', icon: Building2,  classes: 'bg-violet-50 text-violet-700' },
    card:         { label: 'Card',          icon: Building2,  classes: 'bg-slate-50 text-slate-700' },
    credit:       { label: 'Credit',        icon: Banknote,   classes: 'bg-slate-50 text-slate-700' },
    split:        { label: 'Split',         icon: Banknote,   classes: 'bg-slate-50 text-slate-700' },
};

interface Props {
    payments: PaymentEntry[];
    isLoading?: boolean;
}

export function PaymentHistoryList({ payments, isLoading }: Props) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border p-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                    </div>
                ))}
            </div>
        );
    }

    if (!payments.length) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                    <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium">No payments recorded</p>
                <p className="text-sm text-muted-foreground">Payments will appear here once recorded.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {payments.map((pmt) => {
                const modeConf = MODE_CONFIG[pmt.paymentMode] ?? MODE_CONFIG.cash;
                const ModeIcon = modeConf.icon;
                return (
                    <div key={pmt.id} className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', modeConf.classes)}>
                            <ModeIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">
                                {pmt.distributor?.name ?? pmt.distributorId}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(pmt.date), 'dd MMM yyyy')}
                                {pmt.referenceNo && <> · <span className="font-mono">{pmt.referenceNo}</span></>}
                                {pmt.allocations.length > 0 && (
                                    <> · {pmt.allocations.length} invoice{pmt.allocations.length !== 1 ? 's' : ''}</>
                                )}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-sm tabular-nums">{formatINR(pmt.totalAmount)}</p>
                            <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium', modeConf.classes)}>
                                {modeConf.label}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
