'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useOutletId } from '@/hooks/useOutletId';
import { voucherApi } from '@/lib/apiClient';
import { Ledger, Voucher, BillAdjustment } from '@/types';
import { LedgerPicker } from './LedgerPicker';
import { BillAdjustmentModal } from './BillAdjustmentModal';
import { cn } from '@/lib/utils';

type VoucherType = 'receipt' | 'payment' | 'contra' | 'journal';
type PaymentMode = 'cash' | 'bank' | 'upi';

interface LineRow {
    id: string;
    ledger: Ledger | null;
    debit: string;
    credit: string;
    description: string;
}

interface VoucherFormProps {
    initialType?: VoucherType;
    onSuccess?: (voucher: Voucher) => void;
}

const TYPE_LABELS: Record<VoucherType, string> = {
    receipt: 'Receipt',
    payment: 'Payment',
    contra: 'Contra',
    journal: 'Journal',
};

const TYPE_SHORTCUTS: Record<string, VoucherType> = {
    F6: 'receipt',
    F5: 'payment',
    F4: 'contra',
    F7: 'journal',
};

function newLine(): LineRow {
    return { id: Math.random().toString(36).slice(2), ledger: null, debit: '', credit: '', description: '' };
}

export function VoucherForm({ initialType = 'receipt', onSuccess }: VoucherFormProps) {
    const outletId = useOutletId();
    const { toast } = useToast();

    const [voucherType, setVoucherType] = useState<VoucherType>(initialType);
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [voucherNo, setVoucherNo] = useState('');
    const [narration, setNarration] = useState('');
    const [saving, setSaving] = useState(false);
    const [loadingNo, setLoadingNo] = useState(false);

    // Receipt / Payment state
    const [partyLedger, setPartyLedger] = useState<Ledger | null>(null);
    const [cashBankLedger, setCashBankLedger] = useState<Ledger | null>(null);
    const [amount, setAmount] = useState('');
    const [partyOutstanding, setPartyOutstanding] = useState<{ outstanding: number; balanceType: string } | null>(null);
    const [showBillModal, setShowBillModal] = useState(false);
    const [pendingAdjustments, setPendingAdjustments] = useState<BillAdjustment[]>([]);
    const amountBlurredRef = useRef(false);

    // Contra state
    const [contraDebitLedger, setContraDebitLedger] = useState<Ledger | null>(null);
    const [contraCreditLedger, setContraCreditLedger] = useState<Ledger | null>(null);
    const [contraAmount, setContraAmount] = useState('');

    // Journal state
    const [lines, setLines] = useState<LineRow[]>([newLine(), newLine()]);

    // Load next voucher number when type changes
    useEffect(() => {
        if (!outletId) return;
        setLoadingNo(true);
        voucherApi
            .getNextVoucherNo(outletId, voucherType)
            .then((data: any) => setVoucherNo(data.voucherNo || ''))
            .catch(() => {})
            .finally(() => setLoadingNo(false));
    }, [outletId, voucherType]);

    // Fetch outstanding when party ledger changes
    useEffect(() => {
        if (!partyLedger) {
            setPartyOutstanding(null);
            return;
        }
        voucherApi
            .getLedgerOutstanding(partyLedger.id)
            .then((data: any) => setPartyOutstanding({ outstanding: data.outstanding, balanceType: data.balanceType }))
            .catch(() => setPartyOutstanding(null));
    }, [partyLedger]);

    // Keyboard shortcuts
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            const type = TYPE_SHORTCUTS[e.key];
            if (type && !e.ctrlKey && !e.altKey && !e.metaKey) {
                const tag = (e.target as HTMLElement).tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA') return;
                e.preventDefault();
                setVoucherType(type);
            }
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            if (e.key === 'Escape' && !showBillModal) {
                handleClear();
            }
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    });

    function handleClear() {
        setPartyLedger(null);
        setCashBankLedger(null);
        setAmount('');
        setPartyOutstanding(null);
        setPendingAdjustments([]);
        setContraDebitLedger(null);
        setContraCreditLedger(null);
        setContraAmount('');
        setLines([newLine(), newLine()]);
        setNarration('');
        amountBlurredRef.current = false;
    }

    function handleAmountBlur() {
        const amt = parseFloat(amount);
        if (amt > 0 && partyLedger && !amountBlurredRef.current) {
            amountBlurredRef.current = true;
            setShowBillModal(true);
        }
    }

    function handleBillAdjustConfirm(adjustments: BillAdjustment[]) {
        setPendingAdjustments(adjustments);
        setShowBillModal(false);
    }

    function handleBillAdjustSkip() {
        setPendingAdjustments([]);
        setShowBillModal(false);
    }

    // Journal helpers
    const totalDebit = lines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0);
    const totalCredit = lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);

    function updateLine(id: string, field: keyof LineRow, value: any) {
        setLines((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
    }

    function addLine() {
        setLines((prev) => [...prev, newLine()]);
    }

    function removeLine(id: string) {
        setLines((prev) => prev.filter((l) => l.id !== id));
    }

    async function handleSave() {
        if (!outletId) return;
        setSaving(true);
        try {
            let payload: any = {
                outletId,
                voucher_type: voucherType,
                date,
                narration,
            };

            if (voucherType === 'receipt') {
                if (!partyLedger || !cashBankLedger) {
                    toast({ variant: 'destructive', title: 'Select both ledgers' });
                    setSaving(false);
                    return;
                }
                const amt = parseFloat(amount);
                if (!amt || amt <= 0) {
                    toast({ variant: 'destructive', title: 'Enter an amount' });
                    setSaving(false);
                    return;
                }
                payload.total_amount = amt;
                payload.payment_mode = cashBankLedger.groupName === 'Bank Accounts' ? 'bank' : 'cash';
                payload.lines = [
                    { ledger_id: cashBankLedger.id, debit: amt, credit: 0, description: '' },
                    { ledger_id: partyLedger.id, debit: 0, credit: amt, description: '' },
                ];
                payload.bill_adjustments = pendingAdjustments.map((a) => ({
                    invoice_id: a.invoiceId,
                    invoice_type: a.invoiceType,
                    adjusted_amount: a.adjustedAmount,
                }));
            } else if (voucherType === 'payment') {
                if (!partyLedger || !cashBankLedger) {
                    toast({ variant: 'destructive', title: 'Select both ledgers' });
                    setSaving(false);
                    return;
                }
                const amt = parseFloat(amount);
                if (!amt || amt <= 0) {
                    toast({ variant: 'destructive', title: 'Enter an amount' });
                    setSaving(false);
                    return;
                }
                payload.total_amount = amt;
                payload.payment_mode = cashBankLedger.groupName === 'Bank Accounts' ? 'bank' : 'cash';
                payload.lines = [
                    { ledger_id: partyLedger.id, debit: amt, credit: 0, description: '' },
                    { ledger_id: cashBankLedger.id, debit: 0, credit: amt, description: '' },
                ];
                payload.bill_adjustments = pendingAdjustments.map((a) => ({
                    invoice_id: a.invoiceId,
                    invoice_type: a.invoiceType,
                    adjusted_amount: a.adjustedAmount,
                }));
            } else if (voucherType === 'contra') {
                if (!contraDebitLedger || !contraCreditLedger) {
                    toast({ variant: 'destructive', title: 'Select both ledgers' });
                    setSaving(false);
                    return;
                }
                if (contraDebitLedger.id === contraCreditLedger.id) {
                    toast({ variant: 'destructive', title: 'Dr and Cr ledgers must be different' });
                    setSaving(false);
                    return;
                }
                const amt = parseFloat(contraAmount);
                if (!amt || amt <= 0) {
                    toast({ variant: 'destructive', title: 'Enter an amount' });
                    setSaving(false);
                    return;
                }
                payload.total_amount = amt;
                payload.payment_mode = 'cash';
                payload.lines = [
                    { ledger_id: contraDebitLedger.id, debit: amt, credit: 0, description: '' },
                    { ledger_id: contraCreditLedger.id, debit: 0, credit: amt, description: '' },
                ];
            } else {
                // journal
                const validLines = lines.filter((l) => l.ledger);
                if (validLines.length < 2) {
                    toast({ variant: 'destructive', title: 'Add at least two journal lines' });
                    setSaving(false);
                    return;
                }
                if (totalDebit !== totalCredit) {
                    toast({ variant: 'destructive', title: 'Journal must balance (Dr = Cr)' });
                    setSaving(false);
                    return;
                }
                payload.total_amount = totalDebit;
                payload.payment_mode = 'cash';
                payload.lines = validLines.map((l) => ({
                    ledger_id: l.ledger!.id,
                    debit: parseFloat(l.debit) || 0,
                    credit: parseFloat(l.credit) || 0,
                    description: l.description,
                }));
            }

            const voucher = await voucherApi.createVoucher(payload);
            toast({ title: `${TYPE_LABELS[voucherType]} saved`, description: voucher.voucherNo });
            handleClear();
            voucherApi.getNextVoucherNo(outletId, voucherType).then((d: any) => setVoucherNo(d.voucherNo || ''));
            onSuccess?.(voucher);
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Failed to save', description: err?.detail || String(err) });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Voucher Type Selector */}
            <div className="grid grid-cols-4 gap-2">
                {(['receipt', 'payment', 'contra', 'journal'] as VoucherType[]).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => { setVoucherType(t); handleClear(); }}
                        className={cn(
                            'rounded-lg border-2 py-3 text-sm font-medium transition-all',
                            voucherType === t
                                ? 'border-primary bg-primary text-white'
                                : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                        )}
                    >
                        <div>{TYPE_LABELS[t]}</div>
                        <div className="text-xs opacity-60 mt-0.5">
                            {t === 'receipt' ? 'F6' : t === 'payment' ? 'F5' : t === 'contra' ? 'F4' : 'F7'}
                        </div>
                    </button>
                ))}
            </div>

            {/* Header: Date + Voucher No */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label>Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Voucher No</Label>
                    <Input value={loadingNo ? 'Loading...' : voucherNo} readOnly className="bg-muted" />
                </div>
            </div>

            {/* ── Receipt Form ── */}
            {voucherType === 'receipt' && (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Cr. Ledger <span className="text-muted-foreground text-xs">(Received From)</span></Label>
                        <LedgerPicker
                            voucherType="receipt"
                            filterGroup="party"
                            value={partyLedger}
                            onChange={(l) => { setPartyLedger(l); amountBlurredRef.current = false; setPendingAdjustments([]); }}
                            placeholder="Search customer / income ledger..."
                        />
                        {partyOutstanding && partyOutstanding.outstanding > 0 && (
                            <p className="text-xs text-muted-foreground pl-1">
                                Outstanding: ₹{partyOutstanding.outstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })} {partyOutstanding.balanceType}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Amount</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="pl-7"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => { setAmount(e.target.value); amountBlurredRef.current = false; }}
                                onBlur={handleAmountBlur}
                            />
                        </div>
                        {pendingAdjustments.length > 0 && (
                            <p className="text-xs text-green-600 pl-1">
                                {pendingAdjustments.length} bill(s) adjusted — ₹{pendingAdjustments.reduce((s, a) => s + a.adjustedAmount, 0).toFixed(2)}
                                <button
                                    type="button"
                                    className="ml-2 underline"
                                    onClick={() => setShowBillModal(true)}
                                >
                                    Edit
                                </button>
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Dr. Ledger <span className="text-muted-foreground text-xs">(Received In)</span></Label>
                        <LedgerPicker
                            voucherType="receipt"
                            filterGroup="cashbank"
                            value={cashBankLedger}
                            onChange={setCashBankLedger}
                            placeholder="Search cash / bank ledger..."
                        />
                    </div>
                </div>
            )}

            {/* ── Payment Form ── */}
            {voucherType === 'payment' && (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Dr. Ledger <span className="text-muted-foreground text-xs">(Paid To)</span></Label>
                        <LedgerPicker
                            voucherType="payment"
                            filterGroup="party"
                            value={partyLedger}
                            onChange={(l) => { setPartyLedger(l); amountBlurredRef.current = false; setPendingAdjustments([]); }}
                            placeholder="Search supplier / expense ledger..."
                        />
                        {partyOutstanding && partyOutstanding.outstanding > 0 && (
                            <p className="text-xs text-muted-foreground pl-1">
                                Outstanding: ₹{partyOutstanding.outstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })} {partyOutstanding.balanceType}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Amount</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="pl-7"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => { setAmount(e.target.value); amountBlurredRef.current = false; }}
                                onBlur={handleAmountBlur}
                            />
                        </div>
                        {pendingAdjustments.length > 0 && (
                            <p className="text-xs text-green-600 pl-1">
                                {pendingAdjustments.length} bill(s) adjusted — ₹{pendingAdjustments.reduce((s, a) => s + a.adjustedAmount, 0).toFixed(2)}
                                <button
                                    type="button"
                                    className="ml-2 underline"
                                    onClick={() => setShowBillModal(true)}
                                >
                                    Edit
                                </button>
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Cr. Ledger <span className="text-muted-foreground text-xs">(Paid From)</span></Label>
                        <LedgerPicker
                            voucherType="payment"
                            filterGroup="cashbank"
                            value={cashBankLedger}
                            onChange={setCashBankLedger}
                            placeholder="Search cash / bank ledger..."
                        />
                    </div>
                </div>
            )}

            {/* ── Contra Form ── */}
            {voucherType === 'contra' && (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Dr. Ledger <span className="text-muted-foreground text-xs">(Money Going TO)</span></Label>
                        <LedgerPicker
                            voucherType="contra"
                            filterGroup="cashbank"
                            value={contraDebitLedger}
                            onChange={setContraDebitLedger}
                            placeholder="Search cash / bank ledger..."
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Amount</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="pl-7"
                                placeholder="0.00"
                                value={contraAmount}
                                onChange={(e) => setContraAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Cr. Ledger <span className="text-muted-foreground text-xs">(Money Coming FROM)</span></Label>
                        <LedgerPicker
                            voucherType="contra"
                            filterGroup="cashbank"
                            value={contraCreditLedger}
                            onChange={setContraCreditLedger}
                            placeholder="Search cash / bank ledger..."
                        />
                    </div>
                </div>
            )}

            {/* ── Journal Form ── */}
            {voucherType === 'journal' && (
                <div className="space-y-2">
                    <div className="grid grid-cols-[1fr_110px_110px_auto] gap-2 text-xs font-medium text-muted-foreground px-1">
                        <span>Ledger</span>
                        <span className="text-right">Dr (₹)</span>
                        <span className="text-right">Cr (₹)</span>
                        <span />
                    </div>
                    {lines.map((line) => (
                        <div key={line.id} className="grid grid-cols-[1fr_110px_110px_auto] gap-2 items-center">
                            <LedgerPicker
                                value={line.ledger}
                                onChange={(l) => updateLine(line.id, 'ledger', l)}
                            />
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className="text-right"
                                value={line.debit}
                                onChange={(e) => updateLine(line.id, 'debit', e.target.value)}
                            />
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className="text-right"
                                value={line.credit}
                                onChange={(e) => updateLine(line.id, 'credit', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => removeLine(line.id)}
                                className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addLine}
                        className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add line
                    </button>

                    <div className="grid grid-cols-[1fr_110px_110px_auto] gap-2 pt-2 border-t text-sm font-semibold">
                        <span className="text-right text-muted-foreground">Total</span>
                        <span className={cn('text-right', totalDebit !== totalCredit && 'text-destructive')}>
                            ₹{totalDebit.toFixed(2)}
                        </span>
                        <span className={cn('text-right', totalDebit !== totalCredit && 'text-destructive')}>
                            ₹{totalCredit.toFixed(2)}
                        </span>
                        <span />
                    </div>
                    {totalDebit !== totalCredit && totalDebit > 0 && (
                        <p className="text-xs text-destructive">Journal entries must balance (Debit = Credit)</p>
                    )}
                </div>
            )}

            {/* Narration */}
            <div className="space-y-1.5">
                <Label>Narration <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Textarea
                    rows={2}
                    placeholder="Add a note..."
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save <span className="ml-1.5 text-xs opacity-70">Ctrl+S</span>
                </Button>
                {(voucherType === 'receipt' || voucherType === 'payment') && (
                    <Button
                        variant="outline"
                        disabled={saving}
                        onClick={async () => {
                            await handleSave();
                            // Print logic can be wired here
                        }}
                    >
                        Save &amp; Print <span className="ml-1.5 text-xs opacity-70">Ctrl+P</span>
                    </Button>
                )}
                <Button variant="outline" onClick={handleClear} disabled={saving}>
                    Clear <span className="ml-1.5 text-xs opacity-70">Esc</span>
                </Button>
            </div>

            {/* Bill Adjustment Modal */}
            {showBillModal && partyLedger && outletId && (
                <BillAdjustmentModal
                    outletId={outletId}
                    ledgerId={partyLedger.id}
                    totalAmount={parseFloat(amount) || 0}
                    voucherType={voucherType as 'receipt' | 'payment'}
                    onConfirm={handleBillAdjustConfirm}
                    onSkip={handleBillAdjustSkip}
                />
            )}
        </div>
    );
}
