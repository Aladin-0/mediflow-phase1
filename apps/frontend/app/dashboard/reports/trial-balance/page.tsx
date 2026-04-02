'use client';

import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Scale, CheckCircle, XCircle } from 'lucide-react';
import { accountsApi } from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const fmt = (n: number) =>
    n === 0 ? '—' : '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface TrialBalanceResponse {
    groups: Array<{
        group: string;
        ledgers: Array<{
            name: string;
            debit: number;
            credit: number;
            balance: number;
        }>;
    }>;
    total_debit: number;
    total_credit: number;
    balanced: boolean;
}

export default function TrialBalancePage() {
    const user = useAuthStore((s) => s.user);
    const outletId = user?.outletId ?? '';

    const { data, isLoading, isError, refetch } = useQuery<TrialBalanceResponse>({
        queryKey: ['trial-balance', outletId],
        queryFn: () => accountsApi.getTrialBalance(outletId),
        enabled: !!outletId,
        staleTime: 1000 * 60 * 5,
    });

    const balanced = data?.balanced ?? false;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Scale className="h-6 w-6 text-primary" />
                        Trial Balance
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Verify double-entry accounting integrity
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
                    <RefreshCw className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')} />
                    Refresh
                </Button>
            </div>

            {isError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Failed to load trial balance data.
                </div>
            )}

            {/* Balance Status */}
            {data && (
                <div
                    className={cn(
                        'rounded-2xl border p-5',
                        balanced
                            ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'
                            : 'border-red-200 bg-gradient-to-r from-red-50 to-orange-50'
                    )}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {balanced ? (
                                <div className="rounded-xl p-3 bg-green-500">
                                    <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                            ) : (
                                <div className="rounded-xl p-3 bg-red-500">
                                    <XCircle className="h-5 w-5 text-white" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-slate-500">Balance Status</p>
                                <p className="text-xs text-slate-400">Total Debit = Total Credit</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {balanced ? (
                                <Badge className="bg-green-600 text-white">Balanced ✓</Badge>
                            ) : (
                                <Badge variant="destructive">Error: Not Balanced ✗</Badge>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Trial Balance Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Ledger Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Account Name</TableHead>
                                    <TableHead className="text-right">Debit</TableHead>
                                    <TableHead className="text-right">Credit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : !data?.groups?.length ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                                            No ledgers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {data.groups.map((group, idx) => (
                                            <div key={idx}>
                                                {/* Group Header */}
                                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                    <TableCell className="font-semibold text-slate-700 py-3">
                                                        {group.group}
                                                    </TableCell>
                                                    <TableCell className="text-right"></TableCell>
                                                    <TableCell className="text-right"></TableCell>
                                                </TableRow>

                                                {/* Ledgers in group */}
                                                {group.ledgers.map((ledger, ledgerIdx) => (
                                                    <TableRow key={ledgerIdx}>
                                                        <TableCell className="text-slate-700">
                                                            {ledger.name}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-sm">
                                                            {ledger.debit > 0.01 ? fmt(ledger.debit) : '—'}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-sm">
                                                            {ledger.credit > 0.01 ? fmt(ledger.credit) : '—'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </div>
                                        ))}

                                        {/* Total Row */}
                                        <TableRow className="border-t-2 border-slate-900 bg-slate-50">
                                            <TableCell className="font-bold text-slate-900">TOTAL</TableCell>
                                            <TableCell className="text-right font-bold font-mono text-slate-900">
                                                {fmt(data.total_debit)}
                                            </TableCell>
                                            <TableCell className="text-right font-bold font-mono text-slate-900">
                                                {fmt(data.total_credit)}
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Info */}
            {data && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-700">What is a Trial Balance?</p>
                    <p className="mt-1 text-xs leading-relaxed">
                        A trial balance lists all general ledger accounts and their balances at a specific point in time.
                        It&apos;s used to verify that the sum of all debit balances equals the sum of all credit balances,
                        which is a core principle of double-entry accounting.
                    </p>
                </div>
            )}
        </div>
    );
}
