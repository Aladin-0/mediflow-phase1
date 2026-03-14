import { calculateItemTotals, calculateBillTotals, formatCurrency } from '../gst';
import { CartItem } from '../../types';

describe('GST Calculations', () => {

    describe('calculateItemTotals', () => {
        it('calculates correct taxable and gst amounts with 12% GST and discount', () => {
            // mrp: 100, rate: 90, qty: 2, discount: 5%, gst: 12%
            // 90 - 5% = 85.5
            // 85.5 * 2 = 171
            // Taxable = 171 / 1.12 = 152.678... -> 152.68
            // GST = 171 - 152.68 = 18.32
            // total = 171

            const result = calculateItemTotals(100, 90, 2, 5, 12);
            expect(result.taxableAmount).toBeCloseTo(152.68, 2);
            expect(result.gstAmount).toBeCloseTo(18.32, 2);
            expect(result.totalAmount).toBeCloseTo(171, 2);
        });

        it('returns total = taxable when GST is 0%', () => {
            const result = calculateItemTotals(120, 110, 3, 0, 0);
            expect(result.taxableAmount).toBe(330);
            expect(result.gstAmount).toBe(0);
            expect(result.totalAmount).toBe(330);
        });

        it('returns zeroes when qty is 0', () => {
            const result = calculateItemTotals(100, 90, 0, 10, 12);
            expect(result.taxableAmount).toBe(0);
            expect(result.gstAmount).toBe(0);
            expect(result.totalAmount).toBe(0);
        });
    });

    describe('calculateBillTotals', () => {
        it('returns all zeros for an empty cart', () => {
            const totals = calculateBillTotals([]);
            expect(totals.subtotal).toBe(0);
            expect(totals.discountAmount).toBe(0);
            expect(totals.taxableAmount).toBe(0);
            expect(totals.cgstAmount).toBe(0);
            expect(totals.sgstAmount).toBe(0);
            expect(totals.grandTotal).toBe(0);
            expect(totals.amountDue).toBe(0);
        });

        it('calculates correct split for mixed GST rates (0% and 12%)', () => {
            const items: CartItem[] = [
                {
                    batchId: 'b1', productId: 'p1', name: 'Med1', batchNo: 'B1', packSize: 10, packUnit: 'tablet',
                    expiryDate: '2025-01-01', scheduleType: 'OTC', mrp: 100, rate: 80,
                    qtyStrips: 1, qtyLoose: 0, totalQty: 1, saleMode: 'strip',
                    discountPct: 0, gstRate: 12, taxableAmount: 0 /* derived internally later */,
                    gstAmount: 0 /* derived */, totalAmount: 0 /* derived */
                },
                {
                    batchId: 'b2', productId: 'p2', name: 'Med2', batchNo: 'B2', packSize: 10, packUnit: 'tablet',
                    expiryDate: '2025-01-01', scheduleType: 'OTC', mrp: 50, rate: 50,
                    qtyStrips: 2, qtyLoose: 0, totalQty: 2, saleMode: 'strip',
                    discountPct: 0, gstRate: 0, taxableAmount: 0,
                    gstAmount: 0, totalAmount: 0
                }
            ];

            // Math:
            // Item 1: MRP=100, Rate=80, Qty=1, D=0%, GST=12%
            //   raw = 80. Taxable = 80 / 1.12 = 71.43. GST = 8.57.
            // Item 2: MRP=50, Rate=50, Qty=2, D=0%, GST=0%
            //   raw = 100. Taxable = 100. GST = 0.

            // Totals:
            // Subtotal = 100*1 + 50*2 = 200
            // Discount = Subtotal - (80*1 + 50*2) = 200 - 180 = 20
            // Taxable = 71.43 + 100 = 171.43
            // GST = 8.57 -> CGST = 4.285, SGST = 4.285.
            // GrandTotal = 171.43 + 4.29 + 4.29 = 180

            const totals = calculateBillTotals(items);
            expect(totals.subtotal).toBe(200);
            expect(totals.discountAmount).toBe(20);
            expect(totals.taxableAmount).toBeCloseTo(171.43, 2);
            expect(totals.cgstAmount).toBeCloseTo(4.29, 2);
            expect(totals.sgstAmount).toBeCloseTo(4.29, 2); // 4.28 remains due to exact float offsets
            expect(totals.grandTotal).toBe(180);
        });
    });

    describe('formatCurrency', () => {
        it('formats normal values correctly in Indian style', () => {
            expect(formatCurrency(1234.50)).toMatch(/1,234\.5/);
        });

        it('formats lakhs correctly', () => {
            expect(formatCurrency(100000)).toMatch(/1,00,000/);
        });

        it('formats zero correctly', () => {
            expect(formatCurrency(0)).toMatch(/0/);
        });
    });
});
