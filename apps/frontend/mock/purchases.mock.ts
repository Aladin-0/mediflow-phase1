import { PurchaseInvoiceFull } from '../types';
import { mockDistributors } from './distributors.mock';
import { mockProducts } from './products.mock';

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const dayMinus = (days: number) => { const d = new Date(today); d.setDate(d.getDate() - days); return formatDate(d); };
const dayPlus  = (days: number) => { const d = new Date(today); d.setDate(d.getDate() + days); return formatDate(d); };

// ─── Item generators ────────────────────────────────────────────────────────

const makeItem = (
    purchaseId: string,
    seq: number,
    productIdx: number,
    overrides: Partial<ReturnType<typeof buildItem>> = {},
) => buildItem(purchaseId, seq, productIdx, overrides);

function buildItem(purchaseId: string, seq: number, productIdx: number, overrides: any = {}) {
    const product = mockProducts[productIdx] ?? mockProducts[0];
    const defaults = {
        id:               `pi-${purchaseId}-${seq}`,
        purchaseId,
        masterProductId:  product.id,
        product,
        hsnCode:          '300490',
        batchNo:          `BATCH-${String(seq * 10 + productIdx).padStart(3, '0')}`,
        expiryDate:       dayPlus(300),
        pkg:              10,
        qty:              50,
        actualQty:        500,
        freeQty:          5,
        purchaseRate:     25.5,
        discountPct:      10,
        cashDiscountPct:  2,
        gstRate:          12,
        cess:             0,
        mrp:              45.0,
        ptr:              38.5,   // (MRP - 20%) / (1 + GST%)
        pts:              36.6,   // PTR - 5%
        saleRate:         35.0,
        taxableAmount:    1122.75,
        gstAmount:        134.73,
        cessAmount:       0,
        totalAmount:      1257.48,
    };
    return { ...defaults, ...overrides };
}

const inv1Items = [
    makeItem('purchase-1', 1, 0, { hsnCode: '300490', batchNo: 'AJD-001', expiryDate: dayPlus(180), qty: 50, pkg: 10, actualQty: 500, purchaseRate: 25.5, discountPct: 10, cashDiscountPct: 2, gstRate: 12, mrp: 45, ptr: 38.5, pts: 36.6, saleRate: 35, taxableAmount: 1122.75, gstAmount: 134.73, totalAmount: 1257.48 }),
    makeItem('purchase-1', 2, 1, { hsnCode: '300610', batchNo: 'AJD-002', expiryDate: dayPlus(360), qty: 100, pkg: 10, actualQty: 1000, purchaseRate: 15, discountPct: 5, cashDiscountPct: 2, gstRate: 12, mrp: 25, ptr: 21.2, pts: 20.1, saleRate: 20, taxableAmount: 1396.5, gstAmount: 167.58, totalAmount: 1564.08 }),
];

const inv2Items = [
    makeItem('purchase-2', 1, 0, { hsnCode: '300490', batchNo: 'AJD-003', expiryDate: dayPlus(240), qty: 60, pkg: 10, actualQty: 600, purchaseRate: 22, discountPct: 8, cashDiscountPct: 0, gstRate: 12, mrp: 40, ptr: 34, pts: 32.3, saleRate: 32, taxableAmount: 1214.4, gstAmount: 145.73, totalAmount: 1360.13 }),
    makeItem('purchase-2', 2, 1, { hsnCode: '300610', batchNo: 'AJD-004', expiryDate: dayPlus(420), qty: 80, pkg: 6, actualQty: 480, purchaseRate: 18, discountPct: 5, cashDiscountPct: 0, gstRate: 5,  mrp: 30, ptr: 24.8, pts: 23.6, saleRate: 24, taxableAmount: 820.8,  gstAmount: 41.04,  totalAmount: 861.84 }),
];

// purchase-3: near-expiry + 3 items + cold storage
const inv3Items = [
    makeItem('purchase-3', 1, 2, { hsnCode: '300420', batchNo: 'SPW-001', expiryDate: dayPlus(55),  pkg: 6,  qty: 30, actualQty: 180, purchaseRate: 80,  discountPct: 8,  cashDiscountPct: 0, gstRate: 5,  mrp: 120, ptr: 102, pts: 96.9, saleRate: 100, taxableAmount: 2208,    gstAmount: 110.4,  cessAmount: 0, totalAmount: 2318.4  }),
    makeItem('purchase-3', 2, 3, { hsnCode: '300450', batchNo: 'SPW-002', expiryDate: dayPlus(400), pkg: 10, qty: 200, actualQty: 2000, purchaseRate: 18.5, discountPct: 12, cashDiscountPct: 3, gstRate: 12, mrp: 32,  ptr: 27.2, pts: 25.8, saleRate: 26, taxableAmount: 3162.24, gstAmount: 379.47, cessAmount: 0, totalAmount: 3541.71 }),
    makeItem('purchase-3', 3, 4, { hsnCode: '300390', batchNo: 'SPW-003', expiryDate: dayPlus(540), pkg: 1,  qty: 50,  actualQty: 50,   purchaseRate: 350,  discountPct: 5,  cashDiscountPct: 2, gstRate: 18, mrp: 550, ptr: 467.5, pts: 444.1, saleRate: 450, taxableAmount: 16152.5, gstAmount: 2907.45, cessAmount: 0, totalAmount: 19059.95 }),
];

const inv4Items = [
    makeItem('purchase-4', 1, 0, { hsnCode: '300490', batchNo: 'CIP-001', expiryDate: dayPlus(365), pkg: 10, qty: 40, actualQty: 400, purchaseRate: 30, discountPct: 0, cashDiscountPct: 0, gstRate: 12, mrp: 50, ptr: 42.5, pts: 40.4, saleRate: 42, taxableAmount: 1200, gstAmount: 144, totalAmount: 1344 }),
    makeItem('purchase-4', 2, 1, { hsnCode: '300610', batchNo: 'CIP-002', expiryDate: dayPlus(500), pkg: 10, qty: 60, actualQty: 600, purchaseRate: 20, discountPct: 0, cashDiscountPct: 0, gstRate: 5,  mrp: 35, ptr: 29.5, pts: 28,   saleRate: 28, taxableAmount: 1200, gstAmount: 60,  totalAmount: 1260 }),
];

// purchase-5: overdue, 3 items
const inv5Items = [
    makeItem('purchase-5', 1, 2, { hsnCode: '300420', batchNo: 'AJD-OLD-1', expiryDate: dayPlus(180), pkg: 6,  qty: 100, actualQty: 600,  purchaseRate: 75,  discountPct: 10, cashDiscountPct: 3, gstRate: 12, mrp: 130, ptr: 110.5, pts: 105, saleRate: 108, taxableAmount: 3857.85, gstAmount: 462.94, totalAmount: 4320.79 }),
    makeItem('purchase-5', 2, 3, { hsnCode: '300450', batchNo: 'AJD-OLD-2', expiryDate: dayPlus(200), pkg: 10, qty: 300, actualQty: 3000, purchaseRate: 12.5, discountPct: 8,  cashDiscountPct: 0, gstRate: 5,  mrp: 22,  ptr: 18.6,  pts: 17.7, saleRate: 18,  taxableAmount: 3450,    gstAmount: 172.5,  totalAmount: 3622.5 }),
    makeItem('purchase-5', 3, 4, { hsnCode: '300390', batchNo: 'AJD-OLD-3', expiryDate: dayPlus(400), pkg: 1,  qty: 20,  actualQty: 20,   purchaseRate: 600,  discountPct: 5,  cashDiscountPct: 2, gstRate: 18, mrp: 950, ptr: 807.5, pts: 767.1, saleRate: 800, taxableAmount: 11154,   gstAmount: 2007.72, totalAmount: 13161.72 }),
];

// ─── Mock invoices ───────────────────────────────────────────────────────────

export const mockPurchaseInvoices: PurchaseInvoiceFull[] = [
    {
        id: 'purchase-1',
        outletId: 'outlet-001',
        distributorId: 'dist-001',
        distributor: mockDistributors[0],
        purchaseType: 'credit',
        invoiceNo: 'AJD-2026-0089',
        invoiceDate: dayMinus(10),
        dueDate: dayPlus(20),
        purchaseOrderRef: 'PO-2026-012',
        godown: 'main',
        subtotal: 2821.56,
        discountAmount: 302.67,
        taxableAmount: 2519.25,
        gstAmount: 302.31,
        cessAmount: 0,
        freight: 150,
        roundOff: -0.56,
        grandTotal: 2971,
        amountPaid: 2971,
        outstanding: 0,
        createdByName: 'Amit Shah',
        createdAt: new Date(dayMinus(10)).toISOString(),
        items: inv1Items,
    },
    {
        id: 'purchase-2',
        outletId: 'outlet-001',
        distributorId: 'dist-001',
        distributor: mockDistributors[0],
        purchaseType: 'credit',
        invoiceNo: 'AJD-2026-0102',
        invoiceDate: dayMinus(5),
        dueDate: dayPlus(25),
        purchaseOrderRef: undefined,
        godown: 'main',
        subtotal: 2221.97,
        discountAmount: 186.77,
        taxableAmount: 2035.2,
        gstAmount: 186.77,
        cessAmount: 0,
        freight: 0,
        roundOff: 0.03,
        grandTotal: 2222,
        amountPaid: 0,
        outstanding: 2222,
        createdByName: 'Amit Shah',
        createdAt: new Date(dayMinus(5)).toISOString(),
        items: inv2Items,
    },
    {
        id: 'purchase-3',
        outletId: 'outlet-001',
        distributorId: 'dist-002',
        distributor: mockDistributors[1],
        purchaseType: 'credit',
        invoiceNo: 'SPW-2026-0234',
        invoiceDate: dayMinus(3),
        dueDate: dayPlus(42),
        purchaseOrderRef: 'PO-2026-018',
        godown: 'cold_storage',    // cold chain items
        subtotal: 24919.26,
        discountAmount: 3196.87,
        taxableAmount: 21522.74,
        gstAmount: 3397.32,
        cessAmount: 0,
        freight: 200,
        roundOff: -0.06,
        grandTotal: 25120,
        amountPaid: 5000,
        outstanding: 20120,
        createdByName: 'Neha Gupta',
        createdAt: new Date(dayMinus(3)).toISOString(),
        items: inv3Items,
    },
    {
        id: 'purchase-4',
        outletId: 'outlet-001',
        distributorId: 'dist-003',
        distributor: mockDistributors[2],
        purchaseType: 'cash',      // cash purchase — no dueDate
        invoiceNo: 'CIPLA-2026-1123',
        invoiceDate: formatDate(today),
        dueDate: undefined,
        purchaseOrderRef: undefined,
        godown: 'main',
        subtotal: 2400,
        discountAmount: 0,
        taxableAmount: 2400,
        gstAmount: 204,
        cessAmount: 0,
        freight: 0,
        roundOff: 0,
        grandTotal: 2604,
        amountPaid: 2604,
        outstanding: 0,
        createdByName: 'Rajesh Patil',
        createdAt: new Date(formatDate(today)).toISOString(),
        items: inv4Items,
    },
    {
        id: 'purchase-5',
        outletId: 'outlet-001',
        distributorId: 'dist-001',
        distributor: mockDistributors[0],
        purchaseType: 'credit',
        invoiceNo: 'AJD-2026-0071',
        invoiceDate: dayMinus(45),
        dueDate: dayMinus(15),     // ← OVERDUE
        purchaseOrderRef: 'PO-2026-003',
        godown: 'secondary',
        subtotal: 21105.01,
        discountAmount: 2644.62,
        taxableAmount: 18461.85,
        gstAmount: 2643.16,
        cessAmount: 0,
        freight: 350,
        roundOff: -0.01,
        grandTotal: 21455,
        amountPaid: 0,
        outstanding: 21455,
        createdByName: 'Amit Shah',
        createdAt: new Date(dayMinus(45)).toISOString(),
        items: inv5Items,
    },
];
