import { CustomerPurchaseSummary } from '../types';

export const mockPurchaseHistory: Record<string, CustomerPurchaseSummary[]> = {
    "cust-001": [
        { invoiceId: "INV-2026-000001", date: "2026-01-15", total: 846, items: 3, billedBy: "Sunita Devi", paymentMode: "cash" },
        { invoiceId: "INV-2026-000008", date: "2026-02-10", total: 1242, items: 5, billedBy: "Rahul Kumar", paymentMode: "credit" },
        { invoiceId: "INV-2026-000015", date: "2026-02-28", total: 856, items: 4, billedBy: "Sunita Devi", paymentMode: "upi" },
        { invoiceId: "INV-2026-000022", date: "2026-03-05", total: 420, items: 2, billedBy: "Rahul Kumar", paymentMode: "cash" },
        { invoiceId: "INV-2026-000028", date: "2026-03-10", total: 1150, items: 4, billedBy: "Sunita Devi", paymentMode: "upi" },
    ],
    "cust-002": [
        { invoiceId: "INV-2026-000003", date: "2026-01-20", total: 560, items: 2, billedBy: "Sunita Devi", paymentMode: "credit" },
        { invoiceId: "INV-2026-000011", date: "2026-02-08", total: 1340, items: 4, billedBy: "Rahul Kumar", paymentMode: "credit" },
        { invoiceId: "INV-2026-000018", date: "2026-03-01", total: 280, items: 1, billedBy: "Sunita Devi", paymentMode: "cash" },
    ],
    "cust-003": [
        { invoiceId: "INV-2026-000002", date: "2026-01-08", total: 2480, items: 8, billedBy: "Rahul Kumar", paymentMode: "credit" },
        { invoiceId: "INV-2026-000006", date: "2026-01-22", total: 1860, items: 6, billedBy: "Sunita Devi", paymentMode: "cash" },
        { invoiceId: "INV-2026-000010", date: "2026-02-05", total: 920, items: 3, billedBy: "Rahul Kumar", paymentMode: "upi" },
        { invoiceId: "INV-2026-000014", date: "2026-02-15", total: 1780, items: 5, billedBy: "Sunita Devi", paymentMode: "credit" },
        { invoiceId: "INV-2026-000017", date: "2026-02-25", total: 2100, items: 7, billedBy: "Rahul Kumar", paymentMode: "cash" },
        { invoiceId: "INV-2026-000019", date: "2026-03-03", total: 1340, items: 4, billedBy: "Sunita Devi", paymentMode: "upi" },
        { invoiceId: "INV-2026-000024", date: "2026-03-08", total: 2400, items: 9, billedBy: "Rahul Kumar", paymentMode: "credit" },
        { invoiceId: "INV-2026-000030", date: "2026-03-12", total: 890, items: 3, billedBy: "Sunita Devi", paymentMode: "cash" },
    ],
    "cust-004": [
        { invoiceId: "INV-2026-000005", date: "2026-01-18", total: 380, items: 2, billedBy: "Sunita Devi", paymentMode: "cash" },
        { invoiceId: "INV-2026-000020", date: "2026-03-02", total: 560, items: 3, billedBy: "Rahul Kumar", paymentMode: "upi" },
    ],
    "cust-005": [
        { invoiceId: "INV-2026-000004", date: "2025-12-10", total: 1840, items: 5, billedBy: "Rahul Kumar", paymentMode: "credit" },
        { invoiceId: "INV-2026-000009", date: "2026-01-15", total: 2200, items: 7, billedBy: "Sunita Devi", paymentMode: "credit" },
        { invoiceId: "INV-2026-000016", date: "2026-02-20", total: 960, items: 3, billedBy: "Rahul Kumar", paymentMode: "cash" },
        { invoiceId: "INV-2026-000025", date: "2026-03-05", total: 1450, items: 4, billedBy: "Sunita Devi", paymentMode: "upi" },
    ],
    "cust-006": [
        { invoiceId: "INV-2026-000012", date: "2026-02-15", total: 620, items: 3, billedBy: "Sunita Devi", paymentMode: "cash" },
        { invoiceId: "INV-2026-000021", date: "2026-03-04", total: 480, items: 2, billedBy: "Rahul Kumar", paymentMode: "upi" },
        { invoiceId: "INV-2026-000027", date: "2026-03-10", total: 340, items: 1, billedBy: "Sunita Devi", paymentMode: "cash" },
    ],
    "cust-007": [
        { invoiceId: "INV-2025-000088", date: "2025-10-15", total: 1500, items: 4, billedBy: "Rahul Kumar", paymentMode: "credit" },
        { invoiceId: "INV-2026-000007", date: "2025-12-20", total: 820, items: 3, billedBy: "Sunita Devi", paymentMode: "credit" },
    ],
    "cust-008": [
        { invoiceId: "INV-2026-000013", date: "2026-02-12", total: 240, items: 1, billedBy: "Sunita Devi", paymentMode: "cash" },
        { invoiceId: "INV-2026-000023", date: "2026-03-06", total: 380, items: 2, billedBy: "Rahul Kumar", paymentMode: "cash" },
    ],
};
