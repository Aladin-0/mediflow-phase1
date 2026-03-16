import { calculateItemTotals, calculateBillTotals, formatCurrency, isInterState } from '@/lib/gst';
import type { CartItem } from '@/types';

describe('GST Calculations', () => {

    describe('calculateItemTotals', () => {
        it('calculates 12% GST correctly (backward calc)', () => {
            // rate=100, qty=1, 12% GST inclusive → taxable = 100/1.12 ≈ 89.29, gst ≈ 10.71
            const result = calculateItemTotals(120, 100, 1, 0, 12);
            expect(result.totalAmount).toBeCloseTo(100, 1);
            expect(result.taxableAmount).toBeCloseTo(89.29, 1);
            expect(result.gstAmount).toBeCloseTo(10.71, 1);
        });

        it('calculates 5% GST correctly', () => {
            const result = calculateItemTotals(50, 40, 1, 0, 5);
            expect(result.totalAmount).toBeCloseTo(40, 1);
            expect(result.taxableAmount).toBeCloseTo(38.10, 1);
            expect(result.gstAmount).toBeCloseTo(1.90, 1);
        });

        it('calculates 18% GST correctly', () => {
            const result = calculateItemTotals(200, 150, 1, 0, 18);
            expect(result.totalAmount).toBeCloseTo(150, 1);
            expect(result.taxableAmount).toBeCloseTo(127.12, 1);
        });

        it('calculates 0% GST (no tax)', () => {
            const result = calculateItemTotals(50, 40, 1, 0, 0);
            expect(result.totalAmount).toBeCloseTo(40);
            expect(result.taxableAmount).toBeCloseTo(40);
            expect(result.gstAmount).toBe(0);
        });

        it('applies discount before tax calculation', () => {
            // 10% discount: effective rate = rate * (1 - 0.10) = 90
            const result = calculateItemTotals(120, 100, 1, 10, 12);
            const discountedRate = 100 * (1 - 10 / 100); // 90
            expect(result.totalAmount).toBeCloseTo(discountedRate, 1);
        });

        it('returns zero for zero quantity', () => {
            const result = calculateItemTotals(100, 80, 0, 0, 12);
            expect(result.totalAmount).toBe(0);
            expect(result.taxableAmount).toBe(0);
            expect(result.gstAmount).toBe(0);
        });

        it('handles multiple strips (qty=3)', () => {
            const result = calculateItemTotals(120, 100, 3, 0, 12);
            expect(result.totalAmount).toBeCloseTo(300, 1);
        });
    });

    describe('calculateBillTotals', () => {
        const makeItem = (overrides: Partial<CartItem> = {}): CartItem => ({
            batchId: 'batch-1',
            productId: 'prod-1',
            name: 'Test Product',
            packSize: 10,
            packUnit: 'tablet',
            batchNo: 'B001',
            expiryDate: '2027-12-31',
            scheduleType: 'OTC',
            mrp: 100,
            rate: 80,
            qtyStrips: 2,
            qtyLoose: 0,
            totalQty: 2,
            saleMode: 'strip',
            discountPct: 0,
            gstRate: 12,
            taxableAmount: 142.86,
            gstAmount: 17.14,
            totalAmount: 160,
            ...overrides,
        });

        it('handles empty cart', () => {
            const result = calculateBillTotals([]);
            expect(result.grandTotal).toBe(0);
            expect(result.subtotal).toBe(0);
            expect(result.itemCount).toBe(0);
        });

        it('sums multiple line items correctly', () => {
            const item1 = makeItem({ mrp: 100, rate: 80, totalQty: 2, taxableAmount: 142.86, gstAmount: 17.14, totalAmount: 160 });
            const item2 = makeItem({ batchId: 'batch-2', mrp: 50, rate: 40, totalQty: 1, taxableAmount: 35.71, gstAmount: 4.29, totalAmount: 40 });
            const result = calculateBillTotals([item1, item2]);
            expect(result.itemCount).toBe(2);
            expect(result.grandTotal).toBeGreaterThan(0);
        });

        it('calculates grand total with round-off', () => {
            const item = makeItem({ taxableAmount: 100.45, gstAmount: 12.05, totalAmount: 112.50 });
            const result = calculateBillTotals([item]);
            expect(result.grandTotal).toBe(Math.round(result.subtotal - result.discountAmount));
        });

        it('detects Schedule H items', () => {
            const item = makeItem({ scheduleType: 'H' });
            const result = calculateBillTotals([item]);
            expect(result.hasScheduleH).toBe(true);
        });

        it('detects Schedule H1 requires doctor details', () => {
            const item = makeItem({ scheduleType: 'H1' });
            const result = calculateBillTotals([item]);
            expect(result.requiresDoctorDetails).toBe(true);
        });

        it('OTC items do not trigger scheduleH flags', () => {
            const item = makeItem({ scheduleType: 'OTC' });
            const result = calculateBillTotals([item]);
            expect(result.hasScheduleH).toBe(false);
            expect(result.requiresDoctorDetails).toBe(false);
        });
    });

    describe('formatCurrency', () => {
        it('formats zero', () => {
            const result = formatCurrency(0);
            expect(result).toContain('0');
        });

        it('formats a number with ₹ symbol', () => {
            const result = formatCurrency(1000);
            expect(result).toContain('₹');
            expect(result).toContain('1');
        });

        it('formats 100000 in Indian locale format', () => {
            const result = formatCurrency(100000);
            expect(result).toContain('₹');
        });

        it('handles undefined/null gracefully', () => {
            const result = formatCurrency(undefined as any);
            expect(result).toBe('₹0.00');
        });
    });

    describe('isInterState', () => {
        it('returns false for same state', () => {
            expect(isInterState('Maharashtra', 'Maharashtra')).toBe(false);
        });

        it('returns true for different states', () => {
            expect(isInterState('Maharashtra', 'Gujarat')).toBe(true);
        });

        it('returns false for empty strings', () => {
            expect(isInterState('', '')).toBe(false);
        });

        it('is case-insensitive', () => {
            expect(isInterState('MAHARASHTRA', 'maharashtra')).toBe(false);
        });
    });
});
