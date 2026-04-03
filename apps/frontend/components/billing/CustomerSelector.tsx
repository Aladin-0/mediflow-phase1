'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingBag, X, Search, UserPlus, Plus, Check } from 'lucide-react'
import { useBillingStore } from '@/store/billingStore'
import { Ledger } from '@/types'
import { cn } from '@/lib/utils'
import { voucherApi } from '@/lib/apiClient'
import { CreateLedgerModal } from '@/components/accounts/CreateLedgerModal'
import { useOutletId } from '@/hooks/useOutletId'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export function CustomerSelector({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const [search, setSearch] = useState('')
    const [ledgers, setLedgers] = useState<Ledger[]>([])
    const [loading, setLoading] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)

    const { customerLedger, setCustomerLedger } = useBillingStore()
    const outletId = useOutletId()

    // Fetch ledgers (Sundry Debtors) when modal opens or search changes
    useEffect(() => {
        if (!open || !outletId) return
        let cancelled = false
        setLoading(true)

        voucherApi
            .getLedgers(outletId, { group: 'Sundry Debtors', search: search || undefined })
            .then((data: Ledger[]) => { if (!cancelled) setLedgers(data) })
            .catch(() => {})
            .finally(() => { if (!cancelled) setLoading(false) })

        return () => { cancelled = true }
    }, [open, outletId, search])

    // Focus search when dialog opens
    useEffect(() => {
        if (open) {
            setTimeout(() => searchRef.current?.focus(), 100)
            setSearch('')
        }
    }, [open])

    const handleSelectLedger = (ledger: Ledger) => {
        setCustomerLedger(ledger)
        setOpen(false)
    }

    const handleWalkIn = () => {
        setCustomerLedger(null)
        setOpen(false)
    }

    const handleCreateLedger = (ledger: Ledger) => {
        setCustomerLedger(ledger)
        setShowCreate(false)
        setOpen(false)
    }

    return (
        <>
            {/* Trigger — wraps whatever the BillingCart renders as the button */}
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                {children}
            </div>

            {/* Customer Selection Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
                    <DialogHeader className="px-5 py-4 border-b bg-slate-50">
                        <DialogTitle className="flex items-center gap-2 text-base">
                            <UserPlus className="w-4 h-4 text-primary" />
                            Select Party / Customer
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground">Choose a customer account or bill as walk-in</p>
                    </DialogHeader>

                    <div className="p-4 space-y-3">
                        {/* Walk-in Option */}
                        <button
                            type="button"
                            onClick={handleWalkIn}
                            className={cn(
                                'w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm transition-all',
                                !customerLedger
                                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                    : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                            )}
                        >
                            <div className={cn(
                                'flex h-9 w-9 items-center justify-center rounded-lg shrink-0 transition-colors',
                                !customerLedger ? 'bg-primary/10' : 'bg-slate-100'
                            )}>
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                            <div className="text-left flex-1">
                                <div className="font-semibold">Walk-in / Cash Sale</div>
                                <div className="text-xs text-muted-foreground">No customer account needed</div>
                            </div>
                            {!customerLedger && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <div className="flex-1 border-t" />
                            <span>or select a customer ledger</span>
                            <div className="flex-1 border-t" />
                        </div>

                        {/* Search Input */}
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search customer by name or phone..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-slate-700">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Results List */}
                        <div className="max-h-52 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50">
                            {loading && (
                                <div className="px-4 py-3 text-sm text-muted-foreground text-center animate-pulse">
                                    Searching...
                                </div>
                            )}
                            {!loading && ledgers.length === 0 && (
                                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                    {search ? `No customers found for "${search}"` : 'No customers found'}
                                </div>
                            )}
                            {!loading && ledgers.map(ledger => (
                                <button
                                    key={ledger.id}
                                    type="button"
                                    onClick={() => handleSelectLedger(ledger)}
                                    className={cn(
                                        'w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white hover:shadow-sm transition-all border-b border-slate-100 last:border-b-0',
                                        customerLedger?.id === ledger.id && 'bg-primary/5 text-primary'
                                    )}
                                >
                                    <div className="text-left">
                                        <div className="font-medium">{ledger.name}</div>
                                        <div className="text-xs text-muted-foreground">{ledger.groupName}</div>
                                    </div>
                                    {customerLedger?.id === ledger.id && (
                                        <Check className="w-4 h-4 text-primary shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Add New Customer */}
                        <button
                            type="button"
                            onClick={() => { setOpen(false); setShowCreate(true) }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Customer
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create New Customer Modal */}
            {showCreate && outletId && (
                <CreateLedgerModal
                    initialName={search}
                    outletId={outletId}
                    defaultGroupName="Sundry Debtors"
                    onSave={handleCreateLedger}
                    onClose={() => setShowCreate(false)}
                />
            )}
        </>
    )
}
