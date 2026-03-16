import { useBillingStore } from '@/store/billingStore';
import type { CartItem } from '@/types';

const makeCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
    batchId: 'batch-001',
    productId: 'prod-001',
    name: 'Metformin 500mg',
    packSize: 10,
    packUnit: 'tablet',
    batchNo: 'MF2025A1',
    expiryDate: '2027-03-31',
    scheduleType: 'OTC',
    mrp: 37,
    rate: 35,
    qtyStrips: 2,
    qtyLoose: 0,
    totalQty: 2,
    saleMode: 'strip',
    discountPct: 0,
    gstRate: 12,
    taxableAmount: 62.5,
    gstAmount: 7.5,
    totalAmount: 70,
    ...overrides,
});

// Reset store state before each test
beforeEach(() => {
    useBillingStore.setState({
        cart: [],
        activeStaff: null,
        isPinVerified: false,
        customer: null,
        doctor: null,
        scheduleHData: null,
        prescriptionImageUrl: null,
        isCartOpen: false,
        searchQuery: '',
        lastInvoice: null,
        payment: { method: 'cash', amount: 0, cashTendered: 0, cashReturned: 0 },
    });
});

describe('BillingStore — cart', () => {
    it('starts with empty cart', () => {
        expect(useBillingStore.getState().cart).toHaveLength(0);
    });

    it('addToCart adds an item', () => {
        const item = makeCartItem();
        useBillingStore.getState().addToCart(item);
        expect(useBillingStore.getState().cart).toHaveLength(1);
    });

    it('addToCart merges same batchId (updates qty)', () => {
        const item = makeCartItem({ batchId: 'batch-001', totalQty: 1 });
        useBillingStore.getState().addToCart(item);
        useBillingStore.getState().addToCart({ ...item, totalQty: 3 });
        expect(useBillingStore.getState().cart).toHaveLength(1);
        expect(useBillingStore.getState().cart[0].totalQty).toBe(3);
    });

    it('addToCart adds different batchIds as separate items', () => {
        useBillingStore.getState().addToCart(makeCartItem({ batchId: 'batch-001' }));
        useBillingStore.getState().addToCart(makeCartItem({ batchId: 'batch-002' }));
        expect(useBillingStore.getState().cart).toHaveLength(2);
    });

    it('removeFromCart removes by batchId', () => {
        useBillingStore.getState().addToCart(makeCartItem({ batchId: 'batch-001' }));
        useBillingStore.getState().addToCart(makeCartItem({ batchId: 'batch-002' }));
        useBillingStore.getState().removeFromCart('batch-001');
        expect(useBillingStore.getState().cart).toHaveLength(1);
        expect(useBillingStore.getState().cart[0].batchId).toBe('batch-002');
    });

    it('updateCartItem updates a field', () => {
        useBillingStore.getState().addToCart(makeCartItem({ batchId: 'batch-001', totalQty: 1 }));
        useBillingStore.getState().updateCartItem('batch-001', { totalQty: 5 });
        expect(useBillingStore.getState().cart[0].totalQty).toBe(5);
    });

    it('clearCart empties cart and resets customer/doctor', () => {
        useBillingStore.getState().addToCart(makeCartItem());
        useBillingStore.setState({ customer: { id: 'cust-001', name: 'Test', phone: '9999999999', outletId: 'outlet-001', fixedDiscount: 0, creditLimit: 0, outstanding: 0, totalPurchases: 0, isChronic: false, createdAt: '' } });
        useBillingStore.getState().clearCart();
        expect(useBillingStore.getState().cart).toHaveLength(0);
        expect(useBillingStore.getState().customer).toBeNull();
    });
});

describe('BillingStore — PIN / staff', () => {
    it('setActiveStaff sets staff and marks isPinVerified', () => {
        const staff = { id: 'staff-001', name: 'Rajesh Patil', role: 'super_admin' as const, staffPin: '0000', outletId: 'outlet-001' };
        useBillingStore.getState().setActiveStaff(staff as any);
        expect(useBillingStore.getState().activeStaff?.name).toBe('Rajesh Patil');
        expect(useBillingStore.getState().isPinVerified).toBe(true);
    });

    it('clearPin clears staff and isPinVerified', () => {
        const staff = { id: 'staff-001', name: 'Rajesh', role: 'super_admin' as const, staffPin: '0000', outletId: 'outlet-001' };
        useBillingStore.getState().setActiveStaff(staff as any);
        useBillingStore.getState().clearPin();
        expect(useBillingStore.getState().activeStaff).toBeNull();
        expect(useBillingStore.getState().isPinVerified).toBe(false);
    });
});

describe('BillingStore — getTotals', () => {
    it('returns zero totals for empty cart', () => {
        const totals = useBillingStore.getState().getTotals();
        expect(totals.grandTotal).toBe(0);
        expect(totals.itemCount).toBe(0);
        expect(totals.subtotal).toBe(0);
    });

    it('computes grandTotal from cart items', () => {
        useBillingStore.getState().addToCart(makeCartItem({
            mrp: 37, rate: 35, totalQty: 2,
            taxableAmount: 62.5, gstAmount: 7.5, totalAmount: 70,
        }));
        const totals = useBillingStore.getState().getTotals();
        expect(totals.grandTotal).toBeGreaterThan(0);
        expect(totals.itemCount).toBe(1);
    });

    it('detects hasScheduleH for schedule H items', () => {
        useBillingStore.getState().addToCart(makeCartItem({ scheduleType: 'H' }));
        const totals = useBillingStore.getState().getTotals();
        expect(totals.hasScheduleH).toBe(true);
    });

    it('detects requiresDoctorDetails for H1 items', () => {
        useBillingStore.getState().addToCart(makeCartItem({ scheduleType: 'H1' }));
        const totals = useBillingStore.getState().getTotals();
        expect(totals.requiresDoctorDetails).toBe(true);
        expect(totals.hasScheduleH).toBe(true);
    });

    it('OTC items do not set scheduleH flags', () => {
        useBillingStore.getState().addToCart(makeCartItem({ scheduleType: 'OTC' }));
        const totals = useBillingStore.getState().getTotals();
        expect(totals.hasScheduleH).toBe(false);
        expect(totals.requiresDoctorDetails).toBe(false);
    });
});

describe('BillingStore — resetBilling', () => {
    it('resetBilling clears cart and resets isPinVerified', () => {
        useBillingStore.getState().addToCart(makeCartItem());
        const staff = { id: 'staff-001', name: 'Rajesh', role: 'super_admin' as const, staffPin: '0000', outletId: 'outlet-001' };
        useBillingStore.getState().setActiveStaff(staff as any);
        useBillingStore.getState().resetBilling();
        expect(useBillingStore.getState().cart).toHaveLength(0);
        expect(useBillingStore.getState().isPinVerified).toBe(false);
        expect(useBillingStore.getState().activeStaff).toBeNull();
    });

    it('resetBilling does NOT clear lastInvoice', () => {
        useBillingStore.setState({ lastInvoice: { id: 'inv-001' } as any });
        useBillingStore.getState().resetBilling();
        expect(useBillingStore.getState().lastInvoice).not.toBeNull();
    });
});

describe('BillingStore — cartCount', () => {
    it('returns 0 for empty cart', () => {
        expect(useBillingStore.getState().cartCount()).toBe(0);
    });

    it('returns correct count after adding items', () => {
        useBillingStore.getState().addToCart(makeCartItem({ batchId: 'b1' }));
        useBillingStore.getState().addToCart(makeCartItem({ batchId: 'b2' }));
        expect(useBillingStore.getState().cartCount()).toBe(2);
    });
});
