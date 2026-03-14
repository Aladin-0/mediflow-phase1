'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useBillingStore } from '@/store/billingStore';
import { useAuthStore } from '@/store/authStore';
import { salesApi } from '@/lib/apiClient';
import { PaymentSplit } from '@/types';
import { saveOfflineBill } from '@/lib/offline-db';

export function useSaveBill() {
    const billingStore = useBillingStore();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveBill = async (payment: PaymentSplit) => {
        setIsLoading(true);
        setError(null);

        try {
            const cart = useBillingStore.getState().cart;
            const customer = useBillingStore.getState().customer;
            const doctor = useBillingStore.getState().doctor;
            const activeStaff = useBillingStore.getState().activeStaff;
            const scheduleHData = useBillingStore.getState().scheduleHData;
            const totals = useBillingStore.getState().getTotals();
            const { outlet } = useAuthStore.getState();

            const payload = {
                outletId: outlet?.id || 'demo-outlet',
                customerId: customer?.id,
                doctorId: doctor?.id,
                billedBy: activeStaff?.id || 'unknown_staff',
                items: cart.map((item: any) => ({
                    batchId: item.batchId,
                    qtyStrips: item.qtyStrips,
                    qtyLoose: item.qtyLoose,
                    saleMode: item.saleMode,
                    rate: item.rate,
                    discountPct: item.discountPct,
                    gstRate: item.gstRate,
                })),
                payment,
                scheduleHData: totals.requiresDoctorDetails ? scheduleHData : undefined,
            };

            let invoice;

            try {
                // Try to create via API
                invoice = await salesApi.create(payload as never);
            } catch (err: unknown) {
                // Determine if it is a network error (e.g., navigator offline or generic fetch failure)
                const isNetworkError = !navigator.onLine || (err instanceof TypeError && err.message === 'Failed to fetch');
                if (isNetworkError) {
                    await saveOfflineBill(payload);
                    const mockOfflineId = `OFFLINE-${Date.now().toString().slice(-6)}`;
                    invoice = {
                        id: mockOfflineId,
                        invoiceNo: mockOfflineId,
                        outletId: payload.outletId,
                        // ... construct a mock invoice for the UI success screen to render ...
                        items: payload.items.map((i: any) => ({ ...i, id: `item-${Date.now()}` })),
                        subtotal: totals.subtotal,
                        discountAmount: totals.discountAmount,
                        cgst: totals.cgst,
                        sgst: totals.sgst,
                        igst: totals.igst,
                        taxableAmount: totals.taxableAmount,
                        roundOff: totals.roundOff,
                        grandTotal: totals.grandTotal,
                        paymentMode: payment.method,
                        amountPaid: payment.amount,
                        createdAt: new Date().toISOString()
                    };
                    console.log('Saved offline invoice context:', mockOfflineId);
                } else {
                    // It was a real API error response (e.g. 400 Bad Request)
                    throw err;
                }
            }

            // On Success (Online or Offline):
            useBillingStore.getState().setLastInvoice(invoice as any);
            useBillingStore.getState().clearCart();

            // Invalidate dashboard stats cache
            queryClient.invalidateQueries({
                queryKey: ['dashboard']
            });

            return invoice;

        } catch (err: any) {
            const message = err?.error?.message ?? 'Failed to save bill. Please try again.';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { saveBill, isLoading, error };
}
