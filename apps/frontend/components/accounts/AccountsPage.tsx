'use client';

import { useState } from 'react';
import { Wallet, BarChart3, Banknote, User, Receipt } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { OutstandingTab } from './OutstandingTab';
import { PayDistributorSheet } from './PayDistributorSheet';
import { ReceivePaymentSheet } from './ReceivePaymentSheet';
import { ExpensesTab } from './ExpensesTab';
import { cn } from '@/lib/utils';

const TABS = [
    { value: 'outstanding',    label: 'Outstanding',      icon: BarChart3 },
    { value: 'pay',            label: 'Pay Distributor',  icon: Banknote  },
    { value: 'receive',        label: 'Receive Payment',  icon: User      },
    { value: 'expenses',       label: 'Expenses',         icon: Receipt   },
];

export function AccountsPage() {
    const [activeTab, setActiveTab] = useState('outstanding');
    const [paySheetOpen, setPaySheetOpen]     = useState(false);
    const [receiveSheetOpen, setReceiveSheetOpen] = useState(false);
    const [payDistributorId, setPayDistributorId] = useState<string | undefined>();
    const [receiveCustomerId, setReceiveCustomerId] = useState<string | undefined>();

    function openPaySheet(distributorId?: string) {
        setPayDistributorId(distributorId);
        setPaySheetOpen(true);
    }

    function openReceiveSheet(customerId?: string) {
        setReceiveCustomerId(customerId);
        setReceiveSheetOpen(true);
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Wallet className="h-4 w-4" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
                </div>
                <p className="pl-[46px] text-sm text-muted-foreground">
                    Payments, outstanding &amp; expenses
                </p>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Tab bar — underline style matching Purchases page */}
                <div className="flex border-b border-border">
                    {TABS.map(({ value, label, icon: Icon }) => {
                        const isActive = activeTab === value;
                        return (
                            <button
                                key={value}
                                onClick={() => setActiveTab(value)}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-150',
                                    'border-b-2 -mb-px',
                                    'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
                                    isActive && 'border-primary text-primary font-semibold',
                                )}
                            >
                                <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                                {label}
                            </button>
                        );
                    })}
                </div>

                <div className="pt-6">
                    <TabsContent value="outstanding" className="mt-0 outline-none">
                        <OutstandingTab
                            onPayNow={(distId) => openPaySheet(distId)}
                            onReceivePayment={(custId) => openReceiveSheet(custId)}
                        />
                    </TabsContent>

                    <TabsContent value="pay" className="mt-0 outline-none">
                        {/* Render inline trigger for the sheet */}
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Banknote className="h-8 w-8" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-lg">Pay Distributor</p>
                                <p className="text-sm text-muted-foreground mt-1">Record a payment against purchase invoices</p>
                            </div>
                            <button
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                onClick={() => openPaySheet()}
                            >
                                <Banknote className="h-4 w-4" />
                                Open Pay Distributor
                            </button>
                        </div>
                    </TabsContent>

                    <TabsContent value="receive" className="mt-0 outline-none">
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                <User className="h-8 w-8" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-lg">Receive Customer Payment</p>
                                <p className="text-sm text-muted-foreground mt-1">Record a receipt against outstanding customer bills</p>
                            </div>
                            <button
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                                onClick={() => openReceiveSheet()}
                            >
                                <User className="h-4 w-4" />
                                Open Receive Payment
                            </button>
                        </div>
                    </TabsContent>

                    <TabsContent value="expenses" className="mt-0 outline-none">
                        <ExpensesTab />
                    </TabsContent>
                </div>
            </Tabs>

            {/* Global Sheets */}
            <PayDistributorSheet
                open={paySheetOpen}
                onClose={() => { setPaySheetOpen(false); setPayDistributorId(undefined); }}
                preSelectedDistributorId={payDistributorId}
                onSuccess={() => setActiveTab('outstanding')}
            />
            <ReceivePaymentSheet
                open={receiveSheetOpen}
                onClose={() => { setReceiveSheetOpen(false); setReceiveCustomerId(undefined); }}
                preSelectedCustomerId={receiveCustomerId}
                onSuccess={() => setActiveTab('outstanding')}
            />
        </div>
    );
}
