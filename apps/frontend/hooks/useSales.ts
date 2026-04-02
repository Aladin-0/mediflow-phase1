import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { salesApi } from '@/lib/apiClient';
import { SaleInvoiceSummary, SaleItemDetail } from '@/types';

export function useCustomerInvoices(customerId: string) {
    const outletId = useAuthStore((s) => s.user?.outletId ?? '');
    return useQuery<{ data: SaleInvoiceSummary[] }>({
        queryKey: ['sales', 'customer', customerId, outletId],
        queryFn: () => salesApi.listByCustomer(outletId, customerId),
        enabled: !!customerId && !!outletId,
        staleTime: 60_000,
    });
}

export function useInvoiceItems(invoiceId: string | null) {
    return useQuery<{ data: SaleItemDetail[] }>({
        queryKey: ['sale-items', invoiceId],
        queryFn: () => salesApi.getItems(invoiceId!),
        enabled: !!invoiceId,
        staleTime: 300_000,
    });
}
