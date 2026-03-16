'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, ShoppingBag, PlusCircle, User, Loader2 } from 'lucide-react'
import { useBillingStore } from '@/store/billingStore'
import { useCustomerList } from '@/hooks/useCustomers'
import { useDebounce } from '@/hooks/useDebounce'
import { Customer } from '@/types'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/gst'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function CustomerSelector({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const { customer, setCustomer } = useBillingStore()

    // Debounce search query to avoid excessive API calls
    const debouncedSearch = useDebounce(searchQuery, 300)

    // Fetch customers with search filter
    const { data: customers = [], isLoading, error } = useCustomerList(
        debouncedSearch ? { search: debouncedSearch } : undefined
    )

    // Show first 5 customers as "recent" when no search is active
    const displayCustomers = searchQuery ? customers : customers.slice(0, 5)
    const recentCustomers = displayCustomers

    const handleSelect = (selected: Customer | null) => {
        setCustomer(selected)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
                <Command>
                    <CommandInput
                        placeholder="Search customer by name or phone..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList>
                        {isLoading ? (
                            <CommandEmpty className="py-6 text-center text-sm">
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-slate-500">Loading customers...</span>
                                </div>
                            </CommandEmpty>
                        ) : error ? (
                            <CommandEmpty className="py-6 text-center text-sm">
                                <p className="text-slate-500">Error loading customers</p>
                            </CommandEmpty>
                        ) : recentCustomers.length === 0 ? (
                            <CommandEmpty className="py-6 text-center text-sm">
                                <p className="text-slate-500">No customer found.</p>
                                <button className="mt-2 text-primary hover:underline font-medium">
                                    Add New Customer +
                                </button>
                            </CommandEmpty>
                        ) : null}

                        <CommandGroup>
                            <CommandItem
                                onSelect={() => handleSelect(null)}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <ShoppingBag className="w-4 h-4 text-slate-400" />
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-900">Walk-in / Cash Customer</span>
                                    <span className="text-xs text-muted-foreground">No account needed</span>
                                </div>
                                <Check className={cn("ml-auto w-4 h-4", customer === null ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                        </CommandGroup>
                        
                        {recentCustomers.length > 0 && <CommandSeparator />}

                        {recentCustomers.length > 0 && (
                            <CommandGroup heading={searchQuery ? "Search Results" : "Recent Customers"}>
                                {recentCustomers.map((c) => (
                                <CommandItem
                                    key={c.id}
                                    onSelect={() => handleSelect(c)}
                                    className="flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                            <User className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">{c.name}</span>
                                            <span className="text-xs text-muted-foreground">{c.phone}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {c.outstanding > 0 && (
                                            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">
                                                Owes {formatCurrency(c.outstanding)}
                                            </span>
                                        )}
                                        <Check className={cn("w-4 h-4 text-primary", customer?.id === c.id ? "opacity-100" : "opacity-0")} />
                                    </div>
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        )}

                        {recentCustomers.length > 0 && <CommandSeparator />}

                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    // Normally would open a form
                                    setOpen(false)
                                }}
                                className="flex items-center gap-2 text-primary cursor-pointer hover:text-primary hover:bg-blue-50"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span className="font-medium">Add New Customer</span>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
