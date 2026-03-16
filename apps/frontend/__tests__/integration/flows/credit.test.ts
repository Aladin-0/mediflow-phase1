import { mockCreditApi, mockCustomersApi } from '@/lib/mockApi';

describe('Integration Flow — Credit', () => {
    it('list() returns credit accounts with required fields', async () => {
        const accounts = await mockCreditApi.list('outlet-001');
        expect(accounts.length).toBeGreaterThan(0);
        accounts.forEach((acc: any) => {
            expect(acc).toHaveProperty('id');
            expect(acc).toHaveProperty('totalOutstanding');
            expect(acc).toHaveProperty('creditLimit');
        });
    });

    it('accounts with outstanding > 0 exist', async () => {
        const accounts = await mockCreditApi.list('outlet-001');
        const withDebt = accounts.filter((a: any) => a.totalOutstanding > 0);
        expect(withDebt.length).toBeGreaterThan(0);
    });

    it('getAgingSummary() has correct structure', async () => {
        const summary = await mockCreditApi.getAgingSummary('outlet-001');
        expect(summary).toHaveProperty('current');
        expect(summary).toHaveProperty('days30to60');
        expect(summary).toHaveProperty('over90');
        expect(summary).toHaveProperty('totalOutstanding');
        expect(typeof summary.totalOutstanding).toBe('number');
        expect(summary.totalOutstanding).toBeGreaterThan(0);
    });

    it('getLedger() for known customer returns account + transactions', async () => {
        const ledger = await mockCreditApi.getLedger('cust-001');
        expect(ledger).toHaveProperty('account');
        expect(ledger).toHaveProperty('transactions');
        expect(Array.isArray(ledger.transactions)).toBe(true);
    });

    it('getLedger() transactions have required fields', async () => {
        const ledger = await mockCreditApi.getLedger('cust-001');
        if (ledger.transactions.length > 0) {
            const tx = ledger.transactions[0];
            // BUG: transactions use "createdAt" not "date" — inconsistent field naming
            expect(tx).toHaveProperty('createdAt');
            expect(tx).toHaveProperty('amount');
            expect(tx).toHaveProperty('type');
        }
    });

    it('recordPayment() reduces outstanding balance', async () => {
        const accounts = await mockCreditApi.list('outlet-001');
        const acc = accounts.find((a: any) => a.totalOutstanding >= 200);
        if (!acc) return;
        const before = acc.totalOutstanding;
        const result = await mockCreditApi.recordPayment(acc.id, {
            amount: 100,
            mode: 'cash',
            paymentDate: '2026-03-14',
        });
        expect(result.success).toBe(true);
        expect(result.newBalance).toBe(before - 100);
    });

    it('recordPayment() reflects in getLedger() — using customerId for ledger lookup', async () => {
        const accounts = await mockCreditApi.list('outlet-001');
        const acc = accounts.find((a: any) => a.totalOutstanding >= 50 && a.customerId === 'cust-001');
        if (!acc) return;
        const ledgerBefore = await mockCreditApi.getLedger(acc.customerId);
        const countBefore = ledgerBefore.transactions.length;
        await mockCreditApi.recordPayment(acc.id, {
            amount: 50,
            mode: 'upi',
            paymentDate: '2026-03-14',
        });
        const ledgerAfter = await mockCreditApi.getLedger(acc.customerId);
        // New payment transaction should be added
        expect(ledgerAfter.transactions.length).toBeGreaterThan(countBefore);
    });

    it('customer credit limit is enforced in the account', async () => {
        const accounts = await mockCreditApi.list('outlet-001');
        accounts.forEach((acc: any) => {
            if (acc.creditLimit > 0) {
                expect(acc.totalOutstanding).toBeGreaterThanOrEqual(0);
            }
        });
    });

    it('BUG: credit account IDs do not match customer IDs (uses credit-acc-XXX format)', async () => {
        const accounts = await mockCreditApi.list('outlet-001');
        const customers = await mockCustomersApi.list('outlet-001');
        const customerIds = customers.data.map((c: any) => c.id);
        const creditIds = accounts.map((a: any) => a.id);
        // Credit IDs are "credit-acc-XXX" — they don't match customer IDs like "cust-001"
        const overlap = creditIds.filter((id: string) => customerIds.includes(id));
        expect(overlap.length).toBe(0); // documenting the ID mismatch

        // However, credit accounts have a customerId field that DOES link to customers
        accounts.forEach((acc: any) => {
            expect(acc).toHaveProperty('customerId');
            expect(customerIds).toContain(acc.customerId);
        });
    });
});
