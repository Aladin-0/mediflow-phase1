import { CartItem, BillTotals } from '../types';

export function calculateItemTotals(
    mrp: number,
    rate: number,
    qty: number,
    discountPct: number,
    gstRate: number
): { taxableAmount: number; gstAmount: number; totalAmount: number } {
    if (qty <= 0) return { taxableAmount: 0, gstAmount: 0, totalAmount: 0 };

    const discountedRate = rate * (1 - discountPct / 100);
    const rawTotal = discountedRate * qty;

    if (gstRate === 0) {
        return {
            taxableAmount: Number(rawTotal.toFixed(2)),
            gstAmount: 0,
            totalAmount: Number(rawTotal.toFixed(2))
        };
    }

    // Backward calculation logic for GST-inclusive rates (standard in Indian Pharmacy)
    const taxableAmount = rawTotal / (1 + gstRate / 100);
    const gstAmount = rawTotal - taxableAmount;

    return {
        taxableAmount: Number(taxableAmount.toFixed(2)),
        gstAmount: Number(gstAmount.toFixed(2)),
        totalAmount: Number(rawTotal.toFixed(2))
    };
}

export function calculateBillTotals(items: CartItem[]): BillTotals {
    let subtotal = 0;
    let discountedTotalRates = 0;
    let taxableAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;

    items.forEach(item => {
        subtotal += (item.mrp * item.totalQty);
        discountedTotalRates += (item.rate * item.totalQty);

        // Using exactly calculated items
        const totals = calculateItemTotals(
            item.mrp,
            item.rate,
            item.totalQty,
            item.discountPct, // rate already factored in but we rely on exact calculations
            item.gstRate
        );

        taxableAmount += totals.taxableAmount;
        cgstAmount += totals.gstAmount / 2;
        sgstAmount += Math.round(totals.gstAmount * 100) / 100 - (totals.gstAmount / 2); // Avoid floating diffs
    });

    const discountAmount = subtotal - discountedTotalRates;
    const rawTotal = taxableAmount + cgstAmount + sgstAmount;
    const grandTotal = Math.round(rawTotal);
    const roundOff = grandTotal - rawTotal;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        taxableAmount: Number(taxableAmount.toFixed(2)),
        cgstAmount: Number(cgstAmount.toFixed(2)),
        sgstAmount: Number(sgstAmount.toFixed(2)),
        cgst: Number(cgstAmount.toFixed(2)), // For simplicity we assume full rate breakdown
        sgst: Number(sgstAmount.toFixed(2)),
        igst: 0,
        roundOff: Number(roundOff.toFixed(2)),
        grandTotal: Number(grandTotal.toFixed(2)),
        amountPaid: 0,
        amountDue: Number(grandTotal.toFixed(2)),
        itemCount: items.length,
        totalQty: items.reduce((acc, item) => acc + item.totalQty, 0),
        hasScheduleH: items.some(item => ['H', 'H1', 'X', 'Narcotic'].includes(item.scheduleType)),
        requiresDoctorDetails: items.some(item => ['H1', 'X', 'Narcotic'].includes(item.scheduleType))
    };
}

export function isInterState(fromState: string, toState: string): boolean {
    if (!fromState || !toState) return false;
    return fromState.trim().toLowerCase() !== toState.trim().toLowerCase();
}

export function formatCurrency(amount: number): string {
    if (amount === undefined || amount === null) return "₹0.00";

    // Format for Indian locale
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

export function formatGSTIN(gstin: string): string {
    if (!gstin) return "";
    // Validates basic format generally: 2 digits(State code) + 10 chars(PAN) + 1 digit + 'Z' + 1 digit/char
    const cleaned = gstin.toUpperCase().trim();
    return cleaned;
}
