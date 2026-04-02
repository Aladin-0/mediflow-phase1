'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { voucherApi } from '@/lib/apiClient';
import { LedgerStatement } from '@/types';
import { cn } from '@/lib/utils';

export default function LedgerStatementPage() {
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const [statement, setStatement] = useState<LedgerStatement | null>(null);
    const [loading, setLoading] = useState(true);
    const [from, setFrom] = useState(format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'));
    const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));

    function load() {
        if (!id) return;
        setLoading(true);
        voucherApi
            .getLedgerStatement(id, from, to)
            .then(setStatement)
            .catch(() => toast({ variant: 'destructive', title: 'Failed to load statement' }))
            .finally(() => setLoading(false));
    }

    useEffect(() => { load(); }, [id]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/accounts/ledgers">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold">
                        {statement?.ledger.name ?? 'Ledger Statement'}
                    </h1>
                    {statement && (
                        <p className="text-sm text-muted-foreground">
                            {statement.ledger.groupName} · {statement.ledger.nature}
                        </p>
                    )}
                </div>
            </div>

            <Separator />

            {/* Date Filter */}
            <div className="flex items-end gap-3">
                <div className="space-y-1.5">
                    <Label>From</Label>
                    <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
                </div>
                <div className="space-y-1.5">
                    <Label>To</Label>
                    <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
                </div>
                <Button onClick={load} disabled={loading} variant="outline">
                    Apply Filter
                </Button>
            </div>

            {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
            ) : !statement ? null : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg border bg-muted/20 p-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Opening Balance</p>
                            <p className="text-lg font-bold mt-1">
                                ₹{Math.abs(statement.openingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 p-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Transactions</p>
                            <p className="text-lg font-bold mt-1">{statement.transactions.length}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 p-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Closing Balance</p>
                            <p className={cn('text-lg font-bold mt-1', statement.closingBalance < 0 && 'text-destructive')}>
                                ₹{Math.abs(statement.closingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                <span className="text-sm font-normal ml-1 text-muted-foreground">
                                    {statement.closingBalance >= 0 ? statement.ledger.balanceType : (statement.ledger.balanceType === 'Dr' ? 'Cr' : 'Dr')}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    {statement.transactions.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <p>No transactions in this period</p>
                        </div>
                    ) : (
                        <div className="rounded-lg border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Voucher</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Debit</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Credit</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {/* Opening row */}
                                    <tr className="bg-muted/20">
                                        <td className="px-4 py-2 text-muted-foreground text-xs">—</td>
                                        <td className="px-4 py-2 text-muted-foreground text-xs">Opening</td>
                                        <td className="px-4 py-2 text-muted-foreground text-xs" colSpan={3} />
                                        <td className="px-4 py-2 text-right font-medium">
                                            ₹{statement.openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                    {statement.transactions.map((tx, i) => (
                                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-2.5 text-muted-foreground">
                                                {format(new Date(tx.date), 'dd MMM yy')}
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-xs">{tx.voucherNo}</td>
                                            <td className="px-4 py-2.5 text-muted-foreground max-w-xs truncate">{tx.description || '—'}</td>
                                            <td className="px-4 py-2.5 text-right">
                                                {tx.debit > 0 ? `₹${tx.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                {tx.credit > 0 ? `₹${tx.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-medium">
                                                ₹{tx.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
