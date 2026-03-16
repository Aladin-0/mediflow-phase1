import { CreditAccount, CreditTransaction } from '../types';
import { mockCustomers } from './customers.mock';

export const mockCreditAccounts: CreditAccount[] = [
    {
        id: "credit-acc-001",
        customerId: "cust-001",
        customer: mockCustomers[0], // Ramesh Jadhav
        outletId: "outlet-001",
        creditLimit: 2000,
        totalOutstanding: 650,
        totalBorrowed: 5200,
        totalRepaid: 4550,
        status: 'active',
        lastTransactionDate: "2026-03-10T14:30:00Z",
        createdAt: "2025-01-15T00:00:00Z"
    },
    {
        id: "credit-acc-002",
        customerId: "cust-002",
        customer: mockCustomers[1], // Sunita Patil
        outletId: "outlet-001",
        creditLimit: 1500,
        totalOutstanding: 1500,
        totalBorrowed: 3500,
        totalRepaid: 2000,
        status: 'overdue',
        lastTransactionDate: "2026-02-08T10:00:00Z",
        createdAt: "2025-03-25T00:00:00Z"
    },
    {
        id: "credit-acc-003",
        customerId: "cust-003",
        customer: mockCustomers[2], // Mohammad Shaikh
        outletId: "outlet-001",
        creditLimit: 5000,
        totalOutstanding: 3200,
        totalBorrowed: 12000,
        totalRepaid: 8800,
        status: 'partial',
        lastTransactionDate: "2026-03-05T16:45:00Z",
        createdAt: "2024-11-10T00:00:00Z"
    },
    {
        id: "credit-acc-005",
        customerId: "cust-005",
        customer: mockCustomers[4], // Suresh Kulkarni
        outletId: "outlet-001",
        creditLimit: 3000,
        totalOutstanding: 2800,
        totalBorrowed: 9500,
        totalRepaid: 6700,
        status: 'overdue',
        lastTransactionDate: "2026-02-01T11:20:00Z",
        createdAt: "2024-08-20T00:00:00Z"
    },
    {
        id: "credit-acc-006",
        customerId: "cust-006",
        customer: mockCustomers[5], // Priya Wagh
        outletId: "outlet-001",
        creditLimit: 2000,
        totalOutstanding: 400,
        totalBorrowed: 1200,
        totalRepaid: 800,
        status: 'active',
        lastTransactionDate: "2026-03-11T09:15:00Z",
        createdAt: "2025-02-20T00:00:00Z"
    },
    {
        id: "credit-acc-007",
        customerId: "cust-007",
        customer: mockCustomers[6], // Anil Bhosale
        outletId: "outlet-001",
        creditLimit: 1000,
        totalOutstanding: 1000,
        totalBorrowed: 3000,
        totalRepaid: 2000,
        status: 'overdue',
        lastTransactionDate: "2026-01-20T15:30:00Z",
        createdAt: "2025-04-15T00:00:00Z"
    }
];

export const mockCreditTransactions: CreditTransaction[] = [
    // ── Ramesh Jadhav (credit-acc-001) ──
    {
        id: "ctx-001", creditAccountId: "credit-acc-001", customerId: "cust-001",
        invoiceId: "INV-2026-000001", type: "debit", amount: 800,
        description: "Bill #INV-2026-000001", balanceAfter: 800,
        recordedBy: "staff-004", createdAt: "2026-01-15T10:30:00Z", date: "2026-01-15T10:30:00Z"
    },
    {
        id: "ctx-002", creditAccountId: "credit-acc-001", customerId: "cust-001",
        type: "credit", amount: 800,
        description: "Cash payment", balanceAfter: 0,
        recordedBy: "staff-002", createdAt: "2026-01-20T15:00:00Z", date: "2026-01-20T15:00:00Z"
    },
    {
        id: "ctx-003", creditAccountId: "credit-acc-001", customerId: "cust-001",
        invoiceId: "INV-2026-000008", type: "debit", amount: 1200,
        description: "Bill #INV-2026-000008", balanceAfter: 1200,
        recordedBy: "staff-004", createdAt: "2026-02-10T11:00:00Z", date: "2026-02-10T11:00:00Z"
    },
    {
        id: "ctx-004", creditAccountId: "credit-acc-001", customerId: "cust-001",
        type: "credit", amount: 1000,
        description: "UPI payment", balanceAfter: 200,
        recordedBy: "staff-001", createdAt: "2026-02-15T14:20:00Z", date: "2026-02-15T14:20:00Z"
    },
    {
        id: "ctx-005", creditAccountId: "credit-acc-001", customerId: "cust-001",
        invoiceId: "INV-2026-000015", type: "debit", amount: 850,
        description: "Bill #INV-2026-000015", balanceAfter: 1050,
        recordedBy: "staff-005", createdAt: "2026-02-28T09:45:00Z", date: "2026-02-28T09:45:00Z"
    },
    {
        id: "ctx-006", creditAccountId: "credit-acc-001", customerId: "cust-001",
        type: "credit", amount: 400,
        description: "Cash payment", balanceAfter: 650,
        recordedBy: "staff-003", createdAt: "2026-03-10T14:30:00Z", date: "2026-03-10T14:30:00Z"
    },

    // ── Sunita Patil (credit-acc-002) ──
    {
        id: "ctx-007", creditAccountId: "credit-acc-002", customerId: "cust-002",
        invoiceId: "INV-2026-000003", type: "debit", amount: 1200,
        description: "Bill #INV-2026-000003", balanceAfter: 1200,
        recordedBy: "staff-004", createdAt: "2026-01-05T11:00:00Z", date: "2026-01-05T11:00:00Z"
    },
    {
        id: "ctx-008", creditAccountId: "credit-acc-002", customerId: "cust-002",
        type: "credit", amount: 500,
        description: "Cash payment", balanceAfter: 700,
        recordedBy: "staff-002", createdAt: "2026-01-15T16:30:00Z", date: "2026-01-15T16:30:00Z"
    },
    {
        id: "ctx-009", creditAccountId: "credit-acc-002", customerId: "cust-002",
        invoiceId: "INV-2026-000011", type: "debit", amount: 800,
        description: "Bill #INV-2026-000011", balanceAfter: 1500,
        recordedBy: "staff-005", createdAt: "2026-02-08T10:00:00Z", date: "2026-02-08T10:00:00Z"
    },

    // ── Mohammad Shaikh (credit-acc-003) ──
    {
        id: "ctx-010", creditAccountId: "credit-acc-003", customerId: "cust-003",
        invoiceId: "INV-2026-000002", type: "debit", amount: 2500,
        description: "Bill #INV-2026-000002", balanceAfter: 2500,
        recordedBy: "staff-003", createdAt: "2026-01-08T09:30:00Z", date: "2026-01-08T09:30:00Z"
    },
    {
        id: "ctx-011", creditAccountId: "credit-acc-003", customerId: "cust-003",
        type: "credit", amount: 1500,
        description: "NEFT payment", balanceAfter: 1000,
        recordedBy: "staff-001", createdAt: "2026-01-20T12:00:00Z", date: "2026-01-20T12:00:00Z"
    },
    {
        id: "ctx-012", creditAccountId: "credit-acc-003", customerId: "cust-003",
        invoiceId: "INV-2026-000014", type: "debit", amount: 1800,
        description: "Bill #INV-2026-000014", balanceAfter: 2800,
        recordedBy: "staff-004", createdAt: "2026-02-12T10:15:00Z", date: "2026-02-12T10:15:00Z"
    },
    {
        id: "ctx-013", creditAccountId: "credit-acc-003", customerId: "cust-003",
        type: "credit", amount: 800,
        description: "Cash payment", balanceAfter: 2000,
        recordedBy: "staff-002", createdAt: "2026-02-20T15:45:00Z", date: "2026-02-20T15:45:00Z"
    },
    {
        id: "ctx-014", creditAccountId: "credit-acc-003", customerId: "cust-003",
        invoiceId: "INV-2026-000019", type: "debit", amount: 1200,
        description: "Bill #INV-2026-000019", balanceAfter: 3200,
        recordedBy: "staff-005", createdAt: "2026-03-05T16:45:00Z", date: "2026-03-05T16:45:00Z"
    },

    // ── Suresh Kulkarni (credit-acc-005) ──
    {
        id: "ctx-015", creditAccountId: "credit-acc-005", customerId: "cust-005",
        invoiceId: "INV-2026-000004", type: "debit", amount: 1800,
        description: "Bill #INV-2026-000004", balanceAfter: 1800,
        recordedBy: "staff-004", createdAt: "2025-12-10T10:00:00Z", date: "2025-12-10T10:00:00Z"
    },
    {
        id: "ctx-016", creditAccountId: "credit-acc-005", customerId: "cust-005",
        type: "credit", amount: 500,
        description: "Cash payment", balanceAfter: 1300,
        recordedBy: "staff-003", createdAt: "2025-12-25T14:00:00Z", date: "2025-12-25T14:00:00Z"
    },
    {
        id: "ctx-017", creditAccountId: "credit-acc-005", customerId: "cust-005",
        invoiceId: "INV-2026-000010", type: "debit", amount: 2200,
        description: "Bill #INV-2026-000010", balanceAfter: 3500,
        recordedBy: "staff-005", createdAt: "2026-01-15T11:30:00Z", date: "2026-01-15T11:30:00Z"
    },
    {
        id: "ctx-018", creditAccountId: "credit-acc-005", customerId: "cust-005",
        type: "credit", amount: 700,
        description: "UPI payment", balanceAfter: 2800,
        recordedBy: "staff-001", createdAt: "2026-02-01T11:20:00Z", date: "2026-02-01T11:20:00Z"
    },

    // ── Priya Wagh (credit-acc-006) ──
    {
        id: "ctx-019", creditAccountId: "credit-acc-006", customerId: "cust-006",
        invoiceId: "INV-2026-000012", type: "debit", amount: 600,
        description: "Bill #INV-2026-000012", balanceAfter: 600,
        recordedBy: "staff-004", createdAt: "2026-02-15T09:00:00Z", date: "2026-02-15T09:00:00Z"
    },
    {
        id: "ctx-020", creditAccountId: "credit-acc-006", customerId: "cust-006",
        type: "credit", amount: 200,
        description: "Cash payment", balanceAfter: 400,
        recordedBy: "staff-002", createdAt: "2026-03-01T16:00:00Z", date: "2026-03-01T16:00:00Z"
    },
    {
        id: "ctx-021", creditAccountId: "credit-acc-006", customerId: "cust-006",
        invoiceId: "INV-2026-000020", type: "debit", amount: 400,
        description: "Bill #INV-2026-000020", balanceAfter: 800,
        recordedBy: "staff-005", createdAt: "2026-03-08T10:30:00Z", date: "2026-03-08T10:30:00Z"
    },
    {
        id: "ctx-022", creditAccountId: "credit-acc-006", customerId: "cust-006",
        type: "credit", amount: 400,
        description: "Cash payment", balanceAfter: 400,
        recordedBy: "staff-003", createdAt: "2026-03-11T09:15:00Z", date: "2026-03-11T09:15:00Z"
    },

    // ── Anil Bhosale (credit-acc-007) ──
    {
        id: "ctx-023", creditAccountId: "credit-acc-007", customerId: "cust-007",
        invoiceId: "INV-2025-000088", type: "debit", amount: 1500,
        description: "Bill #INV-2025-000088", balanceAfter: 1500,
        recordedBy: "staff-004", createdAt: "2025-10-15T10:00:00Z", date: "2025-10-15T10:00:00Z"
    },
    {
        id: "ctx-024", creditAccountId: "credit-acc-007", customerId: "cust-007",
        type: "credit", amount: 500,
        description: "Cash payment", balanceAfter: 1000,
        recordedBy: "staff-002", createdAt: "2025-11-10T14:30:00Z", date: "2025-11-10T14:30:00Z"
    },
    {
        id: "ctx-025", creditAccountId: "credit-acc-007", customerId: "cust-007",
        invoiceId: "INV-2026-000005", type: "debit", amount: 800,
        description: "Bill #INV-2026-000005", balanceAfter: 1800,
        recordedBy: "staff-005", createdAt: "2025-12-20T09:00:00Z", date: "2025-12-20T09:00:00Z"
    },
    {
        id: "ctx-026", creditAccountId: "credit-acc-007", customerId: "cust-007",
        type: "credit", amount: 800,
        description: "Cash payment", balanceAfter: 1000,
        recordedBy: "staff-003", createdAt: "2026-01-20T15:30:00Z", date: "2026-01-20T15:30:00Z"
    },
];
