'use client'

import { useState, useRef, useEffect } from 'react'
import { Keyboard } from 'lucide-react'
import { useBillingStore } from '@/store/billingStore'
import { StaffPinEntry } from '@/components/billing/StaffPinEntry'
import { StaffActiveBadge } from '@/components/billing/StaffActiveBadge'
import { ProductSearchBar } from '@/components/billing/ProductSearchBar'
import { AddToCartPanel } from '@/components/billing/AddToCartPanel'
import { BillingCart, MobileCartFAB } from '@/components/billing/BillingCart'
import { BillingEmptyState } from '@/components/billing/BillingEmptyState'
import { CustomerSelector } from '@/components/billing/CustomerSelector'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { ProductSearchResult, ScheduleHData, PaymentSplit } from '@/types'
import { ScheduleHModal } from '@/components/billing/ScheduleHModal'
import { PaymentModal } from '@/components/billing/PaymentModal'
import { BillSuccessScreen } from '@/components/billing/BillSuccessScreen'
import { InvoicePreviewModal } from '@/components/billing/InvoicePreviewModal'
import { useSaveBill } from '@/hooks/useSaveBill'

export default function BillingPage() {
    const { 
        isPinVerified, 
        activeStaff, 
        cart, 
        cartCount, 
        getTotals,
        customer,
        scheduleHData,
        setScheduleHData,
        removeFromCart,
        lastInvoice,
        resetBilling
    } = useBillingStore()
    
    const [selectedProduct, setSelectedProduct] = useState<ProductSearchResult | null>(null)
    const [showShortcuts, setShowShortcuts] = useState(false)
    
    // Core Workflow State
    const [showScheduleH, setShowScheduleH] = useState(false)
    const [showPayment, setShowPayment] = useState(false)
    const [showInvoicePreview, setShowInvoicePreview] = useState(false)

    const searchBarRef = useRef<HTMLInputElement>(null)
    const { saveBill, isLoading } = useSaveBill()

    const handleProductSelect = (product: ProductSearchResult) => {
        setSelectedProduct(product)
    }

    const initiateCheckout = () => {
        if (cart.length === 0 || !isPinVerified) return;
        const totals = getTotals();
        
        if (totals.requiresDoctorDetails && !scheduleHData) {
            setShowScheduleH(true);
        } else {
            setShowPayment(true);
        }
    }

    useKeyboardShortcuts({
        '/': () => searchBarRef.current?.focus(),
        'Escape': () => {
            setSelectedProduct(null)
            if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
        },
        'Ctrl+s': initiateCheckout,
        'F2': () => document.getElementById('add-customer-btn')?.click(),
        'F4': () => document.querySelector<HTMLInputElement>('input[type="number"]')?.focus(),
        'Ctrl+z': () => {
            if (cart.length > 0) removeFromCart(cart[cart.length - 1].batchId)
        },
        '?': () => setShowShortcuts(prev => !prev)
    }, isPinVerified && !showPayment && !showScheduleH && !lastInvoice)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isPinVerified) setSelectedProduct(null)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isPinVerified])

    // Bind Proceed to Payment button in BillingCart to our initiateCheckout
    useEffect(() => {
        const btn = document.getElementById('proceed-to-payment-btn');
        if (btn) {
            btn.addEventListener('click', initiateCheckout);
            return () => btn.removeEventListener('click', initiateCheckout);
        }
    }, [cart, isPinVerified, scheduleHData]);

    const handleScheduleHSubmit = (data: Omit<ScheduleHData, 'prescriptionNo'> & { prescriptionNo?: string }) => {
        const fullData: ScheduleHData = {
            ...data,
            prescriptionNo: data.prescriptionNo || ''
        };
        setScheduleHData(fullData);
        setShowScheduleH(false);
        setShowPayment(true);
    };

    const handlePaymentConfirm = async (payment: PaymentSplit) => {
        saveBill(payment);
    };

    const handleStartNewBill = () => {
        resetBilling();
        setShowInvoicePreview(false);
        setTimeout(() => searchBarRef.current?.focus(), 100);
    };

    // If completely done, show success screen overriding POS UI
    if (lastInvoice && !showInvoicePreview) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center -m-4 sm:-m-6 bg-slate-50">
                <BillSuccessScreen 
                    invoice={lastInvoice}
                    onNewBill={handleStartNewBill}
                    onPrint={() => setShowInvoicePreview(true)}
                    onViewInvoice={() => setShowInvoicePreview(true)}
                />
            </div>
        );
    }

    const totals = getTotals();

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden -m-4 sm:-m-6 relative">
            
            {!isPinVerified && <StaffPinEntry />}

            {/* Billing Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm flex-shrink-0 z-10">
                <div className="flex-1 lg:flex-none mr-4">
                    <StaffActiveBadge />
                </div>

                <div className="flex-1 max-w-2xl mx-auto px-4 hidden sm:block">
                    <ProductSearchBar
                        ref={searchBarRef}
                        onProductSelect={handleProductSelect}
                        disabled={!isPinVerified}
                    />
                </div>

                <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground ml-4 shrink-0">
                    <div className="flex items-center gap-1.5"><kbd className="bg-slate-100 rounded px-1.5 py-0.5 border font-sans">/</kbd> Search</div>
                    <div className="flex items-center gap-1.5"><kbd className="bg-slate-100 rounded px-1.5 py-0.5 border font-sans">Ctrl+S</kbd> Save</div>
                    <div className="flex items-center gap-1.5"><kbd className="bg-slate-100 rounded px-1.5 py-0.5 border font-sans">Esc</kbd> Clear</div>
                    
                    <CustomerSelector>
                        <button id="add-customer-btn" className="hidden">Trigger</button>
                    </CustomerSelector>
                </div>
            </div>

            {/* Mobile Search Bar (shows below header on small screens) */}
            <div className="sm:hidden p-3 bg-white border-b shrink-0">
                <ProductSearchBar
                    ref={searchBarRef}
                    onProductSelect={handleProductSelect}
                    disabled={!isPinVerified}
                />
            </div>

            {/* Main billing area */}
            <div className="flex flex-1 overflow-hidden bg-slate-50 relative">
                
                {/* Left: Search results + AddToCart panel */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-6">
                    <div className="max-w-3xl mx-auto h-full">
                        {selectedProduct ? (
                            <AddToCartPanel
                                product={selectedProduct}
                                onAdd={(item) => useBillingStore.getState().addToCart(item)}
                                onClose={() => setSelectedProduct(null)}
                                maxDiscount={activeStaff?.maxDiscount ?? 0}
                            />
                        ) : (
                            <BillingEmptyState isPinVerified={isPinVerified} />
                        )}
                    </div>
                </div>

                {/* Right: Cart panel (desktop only) */}
                <div className="hidden lg:block w-96 shrink-0 bg-white shadow-xl z-10">
                    <BillingCart />
                </div>
            </div>

            {/* Mobile cart FAB */}
            <div className="lg:hidden">
                <MobileCartFAB />
            </div>

            {/* Keyboard Shortcuts Guide Overlay */}
            {showShortcuts && isPinVerified && (
                <div className="fixed bottom-6 left-6 z-50 bg-slate-900/90 text-white text-xs rounded-xl p-5 shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom border border-slate-700">
                    <div className="flex items-center gap-2 mb-3 font-semibold text-sm border-b border-slate-700 pb-2">
                        <Keyboard className="w-4 h-4" /> Keyboard Shortcuts
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Search Product</span>
                            <kbd className="bg-slate-800 px-1.5 rounded">/</kbd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Save Bill</span>
                            <kbd className="bg-slate-800 px-1.5 rounded">Ctrl+S</kbd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Cancel/Clear</span>
                            <kbd className="bg-slate-800 px-1.5 rounded">Esc</kbd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Select Customer</span>
                            <kbd className="bg-slate-800 px-1.5 rounded">F2</kbd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Focus Qty</span>
                            <kbd className="bg-slate-800 px-1.5 rounded">F4</kbd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Undo Add</span>
                            <kbd className="bg-slate-800 px-1.5 rounded">Ctrl+Z</kbd>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-[10px] text-slate-500">
                        Press <kbd className="bg-slate-800 px-1 rounded">?</kbd> to hide this menu
                    </div>
                </div>
            )}

            {/* Modals for Checkouts */}
            <ScheduleHModal 
                isOpen={showScheduleH} 
                onClose={() => setShowScheduleH(false)} 
                onSubmit={handleScheduleHSubmit} 
                isMandatory={totals.requiresDoctorDetails} 
            />

            <PaymentModal 
                isOpen={showPayment} 
                onClose={() => setShowPayment(false)} 
                onConfirm={handlePaymentConfirm} 
                totals={totals}
                isLoading={isLoading}
                customer={customer}
            />

            <InvoicePreviewModal 
                isOpen={showInvoicePreview} 
                onClose={() => setShowInvoicePreview(false)} 
                invoice={lastInvoice} 
                onNewBill={handleStartNewBill}
            />
            
        </div>
    )
}
