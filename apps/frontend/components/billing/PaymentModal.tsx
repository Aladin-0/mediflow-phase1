'use client';

import React, { useState, useEffect } from 'react';
import {
    Receipt, Loader2, Banknote, Smartphone,
    CreditCard, BookOpen, AlertCircle
} from 'lucide-react';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BillTotals, PaymentSplit, Ledger } from '@/types';
import { useBillingStore } from '@/store/billingStore';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (payment: PaymentSplit) => void;
    totals: BillTotals;
    isLoading: boolean;
    customerLedger?: Ledger | null;
}

type TabType = 'cash' | 'upi' | 'card' | 'credit' | 'ledger';

export function PaymentModal({ isOpen, onClose, onConfirm, totals, isLoading, customerLedger }: PaymentModalProps) {
    const { grandTotal } = totals;
    const [activeTab, setActiveTab] = useState<TabType>('cash');

    // === CASH STATE ===
    const [cashTendered, setCashTendered] = useState<number>(Math.ceil(grandTotal));
    const cashChange = cashTendered - grandTotal;

    // === UPI STATE ===
    const [upiRef, setUpiRef] = useState('');

    // === CARD STATE ===
    const [cardLast4, setCardLast4] = useState('');
    const [cardType, setCardType] = useState('Visa');

    // === CREDIT STATE ===
    const [creditGiven, setCreditGiven] = useState<number>(grandTotal);
    const [sendReminder, setSendReminder] = useState(true);

    // === LEDGER STATE ===
    const [ledgerNote, setLedgerNote] = useState('');

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            setCashTendered(Math.ceil(grandTotal));
            setCreditGiven(grandTotal);
            setLedgerNote('');
            setActiveTab('cash');
        }
    }, [isOpen, grandTotal]);

    // Handle Confirm
    const handleConfirm = () => {
        const payment: PaymentSplit = {
            method: activeTab,
            amount: grandTotal,
            cashTendered: 0,
            cashReturned: 0,
            upiRef: '',
            cardLast4: '',
            cardType: '',
            creditGiven: 0,
            splitBreakdown: undefined
        };

        if (activeTab === 'cash') {
            payment.cashTendered = cashTendered;
            payment.cashReturned = Math.max(0, cashChange);
        } else if (activeTab === 'upi') {
            payment.upiRef = upiRef;
        } else if (activeTab === 'card') {
            payment.cardLast4 = cardLast4;
            payment.cardType = cardType;
        } else if (activeTab === 'credit') {
            payment.creditGiven = creditGiven;
        } else if (activeTab === 'ledger') {
            payment.creditGiven = grandTotal;
            payment.ledgerNote = ledgerNote;
            payment.ledgerCustomerId = customerLedger?.id ?? null;
        }

        onConfirm(payment);
    };

    // Disabled Logic
    const totalEntered =
        activeTab === 'cash' ? cashTendered :
        activeTab === 'credit' ? creditGiven :
        grandTotal; // upi / card / ledger always equal grandTotal

    let isConfirmDisabled = isLoading;
    if (totalEntered < grandTotal - 0.01) isConfirmDisabled = true;
    if (activeTab === 'credit' && (!customerLedger || creditGiven <= 0)) isConfirmDisabled = true;
    if (activeTab === 'ledger' && !customerLedger) isConfirmDisabled = true;

    // Listen for Enter key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && isOpen && !isConfirmDisabled) {
                e.preventDefault();
                handleConfirm();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isConfirmDisabled, activeTab, cashTendered]);

    return (
        <Dialog open={isOpen} onOpenChange={(v) => !isLoading && !v && onClose()}>
            <DialogContent data-testid="payment-modal" className="max-w-md" onInteractOutside={e => isLoading && e.preventDefault()}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Collect Payment</DialogTitle>
                            <DialogDescription className="mt-1">
                                <span className="text-3xl font-bold text-slate-900 block">₹{grandTotal.toFixed(2)}</span>
                                <span className="text-sm">for {totals.itemCount} items</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-5 bg-slate-100/50 p-1 mb-6 h-auto">
                        <TabsTrigger value="cash" className="data-[state=active]:bg-primary data-[state=active]:text-white flex flex-col items-center gap-0.5 py-2 h-full">
                            <Banknote className="w-4 h-4" />
                            <span className="text-[10px] font-medium leading-none">Cash</span>
                        </TabsTrigger>
                        <TabsTrigger value="upi" className="data-[state=active]:bg-primary data-[state=active]:text-white flex flex-col items-center gap-0.5 py-2 h-full">
                            <Smartphone className="w-4 h-4" />
                            <span className="text-[10px] font-medium leading-none">UPI</span>
                        </TabsTrigger>
                        <TabsTrigger value="card" className="data-[state=active]:bg-primary data-[state=active]:text-white flex flex-col items-center gap-0.5 py-2 h-full">
                            <CreditCard className="w-4 h-4" />
                            <span className="text-[10px] font-medium leading-none">Card</span>
                        </TabsTrigger>
                        <TabsTrigger value="credit" className="data-[state=active]:bg-primary data-[state=active]:text-white flex flex-col items-center gap-0.5 py-2 h-full">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-[10px] font-medium leading-none">Credit</span>
                        </TabsTrigger>
                        <TabsTrigger value="ledger" className="data-[state=active]:bg-primary data-[state=active]:text-white flex flex-col items-center gap-0.5 py-2 h-full">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-[10px] font-medium leading-none">Ledger</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* --- CASH TAB --- */}
                    <TabsContent value="cash" className="space-y-4 outline-none">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Amount Tendered</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium text-slate-500">₹</span>
                                <Input
                                    data-testid="payment-cash-input"
                                    type="number"
                                    className="pl-8 h-14 text-xl font-medium"
                                    value={cashTendered || ''}
                                    onChange={(e) => setCashTendered(Number(e.target.value))}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pb-2">
                            {[50, 100, 200, 500, 1000, 2000].map(amt => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setCashTendered(amt)}
                                    className={`flex-1 rounded border py-2 text-sm font-medium transition-colors ${
                                        grandTotal > amt ? 'opacity-40 hover:opacity-100 bg-slate-50 text-slate-400' : 'bg-white hover:border-primary hover:text-primary'
                                    }`}
                                >
                                    ₹{amt}
                                </button>
                            ))}
                        </div>

                        {cashChange >= 0 ? (
                            <div className="bg-green-50/80 border border-green-100 text-green-700 rounded-lg p-3 flex justify-between items-center">
                                <span className="font-medium">Return Change:</span>
                                <span className="text-lg font-bold">₹{cashChange.toFixed(2)}</span>
                            </div>
                        ) : (
                            <div className="bg-red-50/80 border border-red-100 text-red-600 rounded-lg p-3 flex justify-between items-center">
                                <span className="font-medium">Short by:</span>
                                <span className="text-lg font-bold">₹{Math.abs(cashChange).toFixed(2)}</span>
                            </div>
                        )}
                    </TabsContent>

                    {/* --- UPI TAB --- */}
                    <TabsContent value="upi" className="space-y-6 outline-none">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">UPI Amount</label>
                            <Input readOnly value={`₹${grandTotal.toFixed(2)}`} className="bg-slate-50 font-medium" />
                        </div>
                        
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Reference ID (Optional)</label>
                            <Input
                                data-testid="payment-upi-input"
                                placeholder="e.g. 123456789012"
                                value={upiRef}
                                onChange={e => setUpiRef(e.target.value)}
                            />
                        </div>
                    </TabsContent>

                    {/* --- CARD TAB --- */}
                    <TabsContent value="card" className="space-y-4 outline-none">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Card Amount</label>
                            <Input readOnly value={`₹${grandTotal.toFixed(2)}`} className="bg-slate-50 font-medium" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Card Type</label>
                                <Select value={cardType} onValueChange={setCardType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Visa">Visa</SelectItem>
                                        <SelectItem value="Mastercard">Mastercard</SelectItem>
                                        <SelectItem value="Rupay">Rupay</SelectItem>
                                        <SelectItem value="Amex">Amex</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Last 4 Digits</label>
                                <Input 
                                    placeholder="XXXX" 
                                    maxLength={4} 
                                    value={cardLast4}
                                    onChange={e => setCardLast4(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* --- CREDIT TAB --- */}
                    <TabsContent value="credit" className="space-y-4 outline-none">
                        {!customerLedger ? (
                            <div className="text-center py-6">
                                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                                <h3 className="text-sm font-medium text-slate-900 mb-1">No Party Selected</h3>
                                <p className="text-xs text-muted-foreground mb-4 max-w-[200px] mx-auto">
                                    Please select a customer ledger (Sundry Debtor) to record credit/udhari.
                                </p>
                                <Button variant="outline" onClick={onClose}>Close & Select Party</Button>
                            </div>
                        ) : (
                            <>
                                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-medium text-slate-900">{customerLedger.name}</p>
                                            <p className="text-xs text-slate-500">{customerLedger.groupName}</p>
                                            {customerLedger.phone && (
                                                <p className="text-xs text-slate-400">{customerLedger.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-3 text-sm">
                                        <div>
                                            <p className="text-xs text-slate-500">Outstanding</p>
                                            <p className="font-semibold text-amber-600">₹{customerLedger.currentBalance?.toFixed(2) || '0.00'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">New Credit Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-slate-500">₹</span>
                                        <Input
                                            type="number"
                                            className="pl-7"
                                            value={creditGiven || ''}
                                            onChange={(e) => setCreditGiven(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <label className="text-sm cursor-pointer select-none font-medium">Send WhatsApp Reminder</label>
                                    <Switch checked={sendReminder} onCheckedChange={setSendReminder} />
                                </div>
                            </>
                        )}
                    </TabsContent>

                    {/* --- LEDGER TAB --- */}
                    <TabsContent value="ledger" className="space-y-4 outline-none">
                        <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                Add to Customer Ledger
                            </div>

                            <div className="text-xs text-slate-500">
                                Party: <span className="font-medium text-slate-800">
                                    {customerLedger?.name ?? 'Walk-in'}
                                </span>
                            </div>

                            {customerLedger && (customerLedger.currentBalance ?? 0) > 0 && (
                                <div className="text-xs text-orange-600">
                                    Current outstanding: ₹{(customerLedger.currentBalance ?? 0).toLocaleString('en-IN')}
                                </div>
                            )}

                            <div className="text-xs text-slate-500">
                                Amount being added to ledger:
                                <span className="font-mono font-semibold text-slate-800 ml-1">
                                    ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            <input
                                className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                                placeholder="Note (optional)"
                                value={ledgerNote}
                                onChange={(e) => setLedgerNote(e.target.value)}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* --- UNIVERSAL SUMMARY ROW --- */}
                <div className="bg-slate-50 rounded-xl p-4 mt-6 border border-slate-100/60">
                    <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-slate-900">₹{totals.subtotal.toFixed(2)}</span>
                        </div>
                        {totals.discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Item Discount</span>
                                <span>-₹{totals.discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        {totals.extraDiscountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Extra Discount</span>
                                <span>-₹{totals.extraDiscountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Taxable</span>
                            <span className="font-medium text-slate-900">₹{totals.taxableAmount.toFixed(2)}</span>
                        </div>
                        {(totals.cgst + totals.sgst) > 0 && (
                            <div className="flex justify-between">
                                <span>GST</span>
                                <span className="font-medium text-slate-900">+₹{(totals.cgst + totals.sgst).toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between items-center">
                        <span className="font-semibold text-slate-900">Grand Total</span>
                        <span className="font-bold text-lg text-slate-900">₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                <DialogFooter className="mt-4 sm:flex-col sm:space-x-0 gap-2">
                    <Button
                        data-testid="payment-confirm-btn"
                        size="lg"
                        className="w-full h-12 text-sm font-semibold"
                        disabled={isConfirmDisabled}
                        onClick={handleConfirm}
                    >
                        {isLoading ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>
                        ) : (
                            `Confirm & Save Bill ₹${grandTotal.toFixed(2)}`
                        )}
                    </Button>
                    <p className="text-center text-[10px] text-muted-foreground mt-2">
                        Press <kbd className="bg-slate-100 border px-1 rounded-sm mx-1 font-sans">Enter</kbd> to confirm.
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
