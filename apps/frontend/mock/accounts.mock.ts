import { PaymentEntry, ExpenseEntry, CustomerOutstanding } from '../types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const dMinus = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt(d); };

// ─── Mock Payment Entries ─────────────────────────────────────────────────────

export const mockPaymentEntries: PaymentEntry[] = [
    {
        id: 'pmt-001',
        outletId: 'outlet-001',
        distributorId: 'dist-001',
        date: dMinus(8),
        totalAmount: 2971,
        paymentMode: 'upi',
        referenceNo: 'UTR123456789',
        notes: 'Payment for AJD-2026-0089',
        allocations: [
            {
                purchaseInvoiceId: 'purchase-1',
                invoiceNo: 'AJD-2026-0089',
                invoiceDate: dMinus(10),
                invoiceTotal: 2971,
                currentOutstanding: 0,
                allocatedAmount: 2971,
            },
        ],
        createdBy: 'staff-001',
        createdAt: new Date(dMinus(8)).toISOString(),
    },
    {
        id: 'pmt-002',
        outletId: 'outlet-001',
        distributorId: 'dist-002',
        date: dMinus(2),
        totalAmount: 5000,
        paymentMode: 'bank_transfer',
        referenceNo: 'TXN987654321',
        notes: 'Part payment for SPW-2026-0234',
        allocations: [
            {
                purchaseInvoiceId: 'purchase-3',
                invoiceNo: 'SPW-2026-0234',
                invoiceDate: dMinus(3),
                invoiceTotal: 25120,
                currentOutstanding: 20120,
                allocatedAmount: 5000,
            },
        ],
        createdBy: 'staff-001',
        createdAt: new Date(dMinus(2)).toISOString(),
    },
    {
        id: 'pmt-003',
        outletId: 'outlet-001',
        distributorId: 'dist-001',
        date: dMinus(30),
        totalAmount: 10000,
        paymentMode: 'cheque',
        referenceNo: 'CHQ-4521',
        allocations: [
            {
                purchaseInvoiceId: 'purchase-5',
                invoiceNo: 'AJD-2026-0071',
                invoiceDate: dMinus(45),
                invoiceTotal: 21455,
                currentOutstanding: 21455,
                allocatedAmount: 10000,
            },
        ],
        createdBy: 'staff-002',
        createdAt: new Date(dMinus(30)).toISOString(),
    },
];

// ─── Mock Expense Entries ─────────────────────────────────────────────────────

export const mockExpenseEntries: ExpenseEntry[] = [
    {
        id: 'exp-001',
        outletId: 'outlet-001',
        date: dMinus(1),
        expenseHead: 'electricity',
        amount: 3200,
        paymentMode: 'upi',
        notes: 'March electricity bill (UTR-ELEC-2026)',
        createdBy: 'staff-001',
        createdAt: new Date(dMinus(1)).toISOString(),
    },
    {
        id: 'exp-002',
        outletId: 'outlet-001',
        date: dMinus(5),
        expenseHead: 'transport',
        amount: 800,
        paymentMode: 'cash',
        notes: 'Auto rickshaw for medicine delivery',
        createdBy: 'staff-001',
        createdAt: new Date(dMinus(5)).toISOString(),
    },
    {
        id: 'exp-003',
        outletId: 'outlet-001',
        date: dMinus(10),
        expenseHead: 'maintenance',
        amount: 2500,
        paymentMode: 'cash',
        notes: 'AC servicing',
        createdBy: 'staff-002',
        createdAt: new Date(dMinus(10)).toISOString(),
    },
    {
        id: 'exp-004',
        outletId: 'outlet-001',
        date: dMinus(15),
        expenseHead: 'marketing',
        amount: 1100,
        paymentMode: 'upi',
        notes: 'Pamphlet printing',
        createdBy: 'staff-001',
        createdAt: new Date(dMinus(15)).toISOString(),
    },
    {
        id: 'exp-005',
        outletId: 'outlet-001',
        date: fmt(new Date(today.getFullYear(), today.getMonth(), 1)),
        expenseHead: 'rent',
        amount: 15000,
        paymentMode: 'bank_transfer',
        notes: 'March shop rent (TXN-RENT-MAR)',
        createdBy: 'staff-001',
        createdAt: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
    },
    {
        id: 'exp-006',
        outletId: 'outlet-001',
        date: fmt(new Date(today.getFullYear(), today.getMonth(), 5)),
        expenseHead: 'salary',
        amount: 45000,
        paymentMode: 'bank_transfer',
        notes: 'March staff salaries (TXN-SAL-MAR)',
        createdBy: 'staff-001',
        createdAt: new Date(today.getFullYear(), today.getMonth(), 5).toISOString(),
    },
];

// ─── Mock Customer Outstanding ────────────────────────────────────────────────

export const mockCustomerOutstanding: CustomerOutstanding[] = [
    {
        customerId: 'cust-001',
        name: 'Meera Joshi',
        phone: '98765 43210',
        totalBills: 4,
        totalOutstanding: 2000,
        overdueAmount: 2000,
    },
    {
        customerId: 'cust-002',
        name: 'Ramesh Deshmukh',
        phone: '91234 56789',
        totalBills: 7,
        totalOutstanding: 8500,
        overdueAmount: 3500,
    },
    {
        customerId: 'cust-003',
        name: 'Sunita Pawar',
        phone: '87654 32109',
        totalBills: 2,
        totalOutstanding: 1200,
        overdueAmount: 0,
    },
];
