'use client'

import { useState } from 'react'
import { ShoppingBag, X, ChevronDown } from 'lucide-react'
import { useBillingStore } from '@/store/billingStore'
import { Ledger } from '@/types'
import { cn } from '@/lib/utils'
import { LedgerPicker } from '@/components/accounts/LedgerPicker'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

export function CustomerSelector({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const { customerLedger, setCustomerLedger } = useBillingStore()

    const handleSelectLedger = (ledger: Ledger | null) => {
        setCustomerLedger(ledger)
        if (ledger) setOpen(false)
    }

    const handleWalkIn = () => {
        setCustomerLedger(null)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-3 space-y-3" align="end">
                {/* Walk-in option */}
                <button
                    type="button"
                    onClick={handleWalkIn}
                    className={cn(
                        'w-full flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                        !customerLedger
                            ? 'border-primary bg-primary/5 text-primary font-medium'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    )}
                >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                        <div className="font-medium">Walk-in / Cash</div>
                        <div className="text-xs text-muted-foreground">No account needed</div>
                    </div>
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="flex-1 border-t" />
                    <span>or select party ledger</span>
                    <div className="flex-1 border-t" />
                </div>

                <LedgerPicker
                    group="Sundry Debtors"
                    value={customerLedger}
                    onChange={handleSelectLedger}
                    placeholder="Search customer ledger..."
                />
            </PopoverContent>
        </Popover>
    )
}
