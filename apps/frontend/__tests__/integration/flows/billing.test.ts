import { mockStaffApi, mockProductsApi, mockSalesApi, mockCustomersApi } from '@/lib/mockApi';
import { useBillingStore } from '@/store/billingStore';
import type { CartItem } from '@/types';

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

describe('Integration Flow — Billing', () => {
    it('full flow: PIN → search product → add to cart → complete sale', async () => {
        // Step 1: Verify PIN
        const staff = await mockStaffApi.verifyPin('0000');
        expect(staff.name).toBe('Rajesh Patil');
        useBillingStore.getState().setActiveStaff(staff as any);
        expect(useBillingStore.getState().isPinVerified).toBe(true);

        // Step 2: Search product
        const products = await mockProductsApi.search('metformin', 'outlet-001');
        expect(products.length).toBeGreaterThan(0);
        const product = products[0];

        // Step 3: Add to cart
        const cartItem: CartItem = {
            batchId: product.batches[0].id,
            productId: product.id,
            name: product.name,
            packSize: product.packSize ?? 10,
            packUnit: product.packUnit ?? 'tablet',
            batchNo: product.batches[0].batchNo,
            expiryDate: product.batches[0].expiryDate,
            scheduleType: product.scheduleType ?? 'OTC',
            mrp: product.batches[0].mrp,
            rate: product.batches[0].saleRate,
            qtyStrips: 2,
            qtyLoose: 0,
            totalQty: 2,
            saleMode: 'strip',
            discountPct: 0,
            gstRate: 12,
            taxableAmount: 62.5,
            gstAmount: 7.5,
            totalAmount: 70,
        };
        useBillingStore.getState().addToCart(cartItem);
        expect(useBillingStore.getState().cart).toHaveLength(1);

        // Step 4: Check totals
        const totals = useBillingStore.getState().getTotals();
        expect(totals.grandTotal).toBeGreaterThan(0);
        expect(totals.itemCount).toBe(1);

        // Step 5: Create sale
        const sale = await mockSalesApi.create({
            outletId: 'outlet-001',
            items: useBillingStore.getState().cart,
            subtotal: totals.subtotal,
            grandTotal: totals.grandTotal,
            paymentMode: 'cash',
        });
        expect(sale).toHaveProperty('invoiceNo');
        expect(sale.invoiceNo).toMatch(/INV-2026-/);

        // Step 6: Reset billing
        useBillingStore.getState().resetBilling();
        expect(useBillingStore.getState().cart).toHaveLength(0);
        expect(useBillingStore.getState().isPinVerified).toBe(false);
    });

    it('invalid PIN rejects and does not set activeStaff', async () => {
        await expect(mockStaffApi.verifyPin('9999')).rejects.toMatchObject({
            error: { code: 'INVALID_PIN' },
        });
        expect(useBillingStore.getState().isPinVerified).toBe(false);
        expect(useBillingStore.getState().activeStaff).toBeNull();
    });

    it('adding same product twice merges qty', async () => {
        const products = await mockProductsApi.search('parac', 'outlet-001');
        if (products.length === 0) return;
        const p = products[0];
        const item: CartItem = {
            batchId: p.batches[0].id,
            productId: p.id,
            name: p.name,
            packSize: 10,
            packUnit: 'tablet',
            batchNo: p.batches[0].batchNo,
            expiryDate: p.batches[0].expiryDate,
            scheduleType: 'OTC',
            mrp: p.batches[0].mrp,
            rate: p.batches[0].saleRate,
            qtyStrips: 1,
            qtyLoose: 0,
            totalQty: 1,
            saleMode: 'strip',
            discountPct: 0,
            gstRate: 5,
            taxableAmount: 19,
            gstAmount: 1,
            totalAmount: 20,
        };
        useBillingStore.getState().addToCart(item);
        useBillingStore.getState().addToCart({ ...item, totalQty: 3 });
        expect(useBillingStore.getState().cart).toHaveLength(1);
        expect(useBillingStore.getState().cart[0].totalQty).toBe(3);
    });

    it('billing with customer — customer is set in store', async () => {
        const customers = await mockCustomersApi.list('outlet-001');
        const customer = customers.data[0];
        useBillingStore.getState().setCustomer(customer);
        expect(useBillingStore.getState().customer?.id).toBe(customer.id);
    });

    it('clearCart resets customer to null', async () => {
        const customers = await mockCustomersApi.list('outlet-001');
        useBillingStore.getState().setCustomer(customers.data[0]);
        useBillingStore.getState().clearCart();
        expect(useBillingStore.getState().customer).toBeNull();
    });

    it('getSaleById() for non-existent ID rejects', async () => {
        await expect(mockSalesApi.getById('fake-invoice-999')).rejects.toBeTruthy();
    });
});
