import { PurchaseInvoiceFull } from '../types';
import { mockDistributors } from './distributors.mock';
import { mockProducts } from './products.mock';

// Generate some sample dates based on 'today' 
const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const dayMinus = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - days);
    return formatDate(d);
};

const dayPlus = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return formatDate(d);
};

// Generate sample items using existing mock products
const generateItems = (purchaseId: string) => {
    return [
        {
            id: `pi-${purchaseId}-1`,
            purchaseId: purchaseId,
            masterProductId: mockProducts[0].id,
            product: mockProducts[0],
            batchNo: `BJX00${Math.floor(Math.random() * 100)}`,
            expiryDate: dayPlus(180),
            qty: 50,
            freeQty: 5,
            purchaseRate: 25.5,
            discountPct: 10,
            gstRate: 12,
            mrp: 45.0,
            saleRate: 35.0,
            taxableAmount: 1147.5,
            gstAmount: 137.7,
            totalAmount: 1285.2
        },
        {
            id: `pi-${purchaseId}-2`,
            purchaseId: purchaseId,
            masterProductId: mockProducts[1].id,
            product: mockProducts[1],
            batchNo: `AZD00${Math.floor(Math.random() * 100)}`,
            expiryDate: dayPlus(300),
            qty: 100,
            freeQty: 10,
            purchaseRate: 15.0,
            discountPct: 5,
            gstRate: 12,
            mrp: 25.0,
            saleRate: 20.0,
            taxableAmount: 1425.0,
            gstAmount: 171.0,
            totalAmount: 1596.0
        }
    ];
};

export const mockPurchaseInvoices: PurchaseInvoiceFull[] = [
    {
        id: "purchase-1",
        outletId: "outlet-001",
        distributorId: "dist-001",
        distributor: mockDistributors[0],
        invoiceNo: "AJD-2026-0089",
        invoiceDate: dayMinus(10),
        dueDate: dayPlus(20),
        subtotal: 12450,
        discountAmount: 0,
        taxableAmount: 11116.07,
        gstAmount: 1333.93,
        grandTotal: 12450,
        amountPaid: 12450,
        outstanding: 0,
        createdByName: "Amit Shah",
        createdAt: new Date(dayMinus(10)).toISOString(),
        items: generateItems("purchase-1")
    },
    {
        id: "purchase-2",
        outletId: "outlet-001",
        distributorId: "dist-001",
        distributor: mockDistributors[0],
        invoiceNo: "AJD-2026-0102",
        invoiceDate: dayMinus(5),
        dueDate: dayPlus(25),
        subtotal: 8900,
        discountAmount: 0,
        taxableAmount: 7946.43,
        gstAmount: 953.57,
        grandTotal: 8900,
        amountPaid: 0,
        outstanding: 8900,
        createdByName: "Amit Shah",
        createdAt: new Date(dayMinus(5)).toISOString(),
        items: generateItems("purchase-2")
    },
    {
        id: "purchase-3",
        outletId: "outlet-001",
        distributorId: "dist-002",
        distributor: mockDistributors[1],
        invoiceNo: "SPW-2026-0234",
        invoiceDate: dayMinus(3),
        dueDate: dayPlus(42),
        subtotal: 15600,
        discountAmount: 0,
        taxableAmount: 13928.57,
        gstAmount: 1671.43,
        grandTotal: 15600,
        amountPaid: 5000,
        outstanding: 10600,
        createdByName: "Neha Gupta",
        createdAt: new Date(dayMinus(3)).toISOString(),
        items: generateItems("purchase-3")
    },
    {
        id: "purchase-4",
        outletId: "outlet-001",
        distributorId: "dist-003",
        distributor: mockDistributors[2],
        invoiceNo: "CIPLA-2026-1123",
        invoiceDate: formatDate(today),
        dueDate: dayPlus(21),
        subtotal: 6300,
        discountAmount: 0,
        taxableAmount: 5625.0,
        gstAmount: 675.0,
        grandTotal: 6300,
        amountPaid: 6300,
        outstanding: 0,
        createdByName: "Rajesh Patil",
        createdAt: new Date(formatDate(today)).toISOString(),
        items: generateItems("purchase-4")
    },
    {
        id: "purchase-5",
        outletId: "outlet-001",
        distributorId: "dist-001",
        distributor: mockDistributors[0],
        invoiceNo: "AJD-2026-0071",
        invoiceDate: dayMinus(45), // 45 days ago
        dueDate: dayMinus(15),     // Overdue by 15 days
        subtotal: 22000,
        discountAmount: 0,
        taxableAmount: 19642.86,
        gstAmount: 2357.14,
        grandTotal: 22000,
        amountPaid: 0,
        outstanding: 22000,
        createdByName: "Amit Shah",
        createdAt: new Date(dayMinus(45)).toISOString(),
        items: generateItems("purchase-5")
    }
];
