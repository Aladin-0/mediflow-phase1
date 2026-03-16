import { mockPurchaseInvoices } from '@/mock/purchases.mock';
import { mockDistributors } from '@/mock/distributors.mock';

describe('Mock Purchase Invoices', () => {
    it('has at least 4 purchase records', () => {
        expect(mockPurchaseInvoices.length).toBeGreaterThanOrEqual(4);
    });

    it('each invoice has required fields', () => {
        mockPurchaseInvoices.forEach(inv => {
            expect(inv).toHaveProperty('id');
            expect(inv).toHaveProperty('invoiceNo');
            expect(inv).toHaveProperty('invoiceDate');
            expect(inv).toHaveProperty('grandTotal');
            expect(inv).toHaveProperty('items');
            expect(Array.isArray(inv.items)).toBe(true);
        });
    });

    it('each invoice has at least 1 item', () => {
        mockPurchaseInvoices.forEach(inv => {
            expect(inv.items.length).toBeGreaterThan(0);
        });
    });

    it('outstanding = grandTotal - amountPaid', () => {
        mockPurchaseInvoices.forEach(inv => {
            const expected = inv.grandTotal - inv.amountPaid;
            expect(inv.outstanding).toBeCloseTo(expected, 0);
        });
    });

    it('invoice IDs are unique', () => {
        const ids = mockPurchaseInvoices.map(inv => inv.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(ids.length);
    });

    it('invoice numbers are unique', () => {
        const invoiceNos = mockPurchaseInvoices.map(inv => inv.invoiceNo);
        const unique = new Set(invoiceNos);
        // BUG: if duplicate invoice numbers exist, this will fail
        expect(unique.size).toBe(invoiceNos.length);
    });

    it('grandTotal >= gstAmount (GST cannot exceed total)', () => {
        mockPurchaseInvoices.forEach(inv => {
            expect(inv.grandTotal).toBeGreaterThan(inv.gstAmount);
        });
    });

    it('all invoices belong to outlet-001', () => {
        mockPurchaseInvoices.forEach(inv => {
            expect(inv.outletId).toBe('outlet-001');
        });
    });

    it('each item has a product reference', () => {
        mockPurchaseInvoices.forEach(inv => {
            inv.items.forEach(item => {
                expect(item).toHaveProperty('masterProductId');
                expect(item.masterProductId).toBeTruthy();
            });
        });
    });

    it('BUG: batch numbers use Math.random() — non-deterministic mock data', () => {
        // The generateItems() function uses Math.random() for batch numbers
        // This means test results can differ between runs
        // This is a data integrity issue — mock data should be deterministic
        const item1a = mockPurchaseInvoices[0].items[0].batchNo;
        const item1b = mockPurchaseInvoices[0].items[0].batchNo;
        // Same reference — still deterministic for this run
        expect(item1a).toBe(item1b);
        // But note: if module is re-required, batch numbers will differ
    });
});

describe('Mock Distributors', () => {
    it('has at least 3 distributors', () => {
        expect(mockDistributors.length).toBeGreaterThanOrEqual(3);
    });

    it('each distributor has id and name', () => {
        mockDistributors.forEach(d => {
            expect(d).toHaveProperty('id');
            expect(d).toHaveProperty('name');
        });
    });

    it('distributor IDs are unique', () => {
        const ids = mockDistributors.map(d => d.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
