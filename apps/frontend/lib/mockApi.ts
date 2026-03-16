import { addDays, differenceInDays, format } from 'date-fns';
import {
    AuthResponse,
    StaffPinVerifyResponse,
    ProductSearchResult,
    SaleInvoice,
    PaginatedResponse,
    CreditAccount,
    CreditTransaction,
    DashboardKPI,
    DashboardAlerts,
    StaffMember,
    StaffPerformance,
    CreatePurchasePayload,
    PurchaseInvoiceFull,
    DistributorLedgerEntry,
    CustomerFull,
    CustomerFilters,
    CustomerPurchaseSummary,
    AttendanceRecord,
    AttendanceSummary,
    KioskCheckPayload,
    MonthlyAttendanceFilter,
    AttendanceStatus,
    DateRangeFilter,
    SalesReportRow,
    GSTSummary,
    StockValuationRow,
    ExpiryReportRow,
    StaffReportRow,
    PurchaseReportRow,
    ReportSummaryCard,
} from '../types';
import {
    mockStaff,
    mockProducts,
    mockBatches,
    mockSalesInvoices,
    mockCreditAccounts,
    mockCreditTransactions,
    mockDashboardKPI,
    mockAlertSummary,
    mockDistributors,
    mockCustomers,
    mockPurchaseInvoices,
    mockDoctors,
    mockPurchaseHistory,
    mockAttendanceRecords,
    mockAttendanceSummaries,
    STAFF_SHIFT_START,
    mockSalesReportData,
    mockSalesReportFeb2026,
    mockGSTSummary,
    mockStockValuation,
    mockExpiryReport,
    mockStaffReport,
    mockPurchaseReport,
    mockPaymentEntries,
    mockExpenseEntries,
    mockCustomerOutstanding,
} from '../mock';
import {
    PaymentEntry,
    ReceiptEntry,
    ExpenseEntry,
    CreatePaymentPayload,
    CreateReceiptPayload,
    CreateExpensePayload,
    DistributorOutstanding,
    CustomerOutstanding,
    LedgerEntry,
} from '../types';
import { formatCurrency } from './gst';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthApi = {
    login: async (phone: string, password: string): Promise<AuthResponse> => {
        await delay(300);
        const staff = mockStaff.find(s => s.phone === phone);
        if (!staff) {
            throw { error: { code: 'INVALID_CREDENTIALS', message: 'Phone number not registered' } };
        }
        if (password !== "password123") {
            throw { error: { code: 'INVALID_CREDENTIALS', message: 'Phone number not registered' } };
        }
        return {
            access: `mock-jwt-${staff.id}`,
            refresh: `mock-refresh-${staff.id}`,
            user: {
                id: staff.id,
                name: staff.name,
                phone: staff.phone,
                role: staff.role,
                staffPin: staff.staffPin,
                maxDiscount: staff.maxDiscount,
                canEditRate: staff.canEditRate,
                canViewPurchaseRates: staff.canViewPurchaseRates,
                canCreatePurchases: staff.canCreatePurchases,
                canAccessReports: staff.canAccessReports,
                outletId: staff.outletId,
                outlet: {
                    id: staff.outletId,
                    organizationId: "org-001",
                    name: "Ahilyanagar Main Branch",
                    address: "Shop No 5, Savedi Road",
                    city: "Ahilyanagar",
                    state: "Maharashtra",
                    pincode: "414003",
                    gstin: "27AABCA1234A1Z5",
                    drugLicenseNo: "MH/AHM/001/2024",
                    phone: "02412-245678",
                    isActive: true,
                    createdAt: "2024-01-01T00:00:00Z"
                },
            },
        };
    },
    logout: async (): Promise<void> => {
        await delay(300);
    }
};

export const mockProductsApi = {
    search: async (q: string, outletId: string): Promise<ProductSearchResult[]> => {
        await delay(300);
        if (q.length < 2) return [];
        const query = q.toLowerCase();

        return mockProducts
            .filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.composition.toLowerCase().includes(query) ||
                p.manufacturer.toLowerCase().includes(query)
            )
            .map(p => {
                const pBatches = mockBatches.filter(b => b.outletProductId === p.id && b.outletId === outletId);
                const totalStock = pBatches.reduce((acc, curr) => acc + curr.qtyStrips, 0);
                return {
                    ...p,
                    outletProductId: p.id,
                    totalStock,
                    nearestExpiry: pBatches.length > 0 ? pBatches[0].expiryDate : "2099-12-31",
                    isLowStock: totalStock < 10,
                    batches: pBatches
                };
            });
    },
    getStock: async (productId: string, outletId: string) => {
        await delay(300);
        return mockBatches.filter(b => b.outletProductId === productId && b.outletId === outletId);
    }
};

export const mockSalesApi = {
    create: async (payload: any): Promise<SaleInvoice> => {
        await delay(300);
        const newInvoiceNo = "INV-2026-" + String(Date.now()).slice(-6);
        const newInvoice: SaleInvoice = {
            ...payload,
            id: "sale-mock-" + Date.now(),
            invoiceNo: newInvoiceNo,
            invoiceDate: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        return newInvoice;
    },
    list: async (outletId: string, params?: any): Promise<PaginatedResponse<SaleInvoice>> => {
        await delay(300);
        const filtered = mockSalesInvoices.filter(inv => inv.outletId === outletId);
        return {
            data: filtered,
            pagination: {
                page: 1,
                pageSize: 50,
                totalPages: 1,
                totalRecords: filtered.length
            }
        };
    },
    getById: async (id: string): Promise<SaleInvoice> => {
        await delay(300);
        const inv = mockSalesInvoices.find(i => i.id === id);
        if (inv) return inv;
        throw { error: { code: 'NOT_FOUND', message: "Invoice not found" } };
    },
    getPdf: async (id: string): Promise<null> => {
        await delay(300);
        return null; // PDF not mocked
    },
    createReturn: async (id: string, payload: any): Promise<SaleInvoice> => {
        await delay(300);
        return {
            ...mockSalesInvoices.find(i => i.id === id)!,
            id: "return-mock-" + Date.now(),
            isReturn: true,
            amountPaid: -payload.amount,
            grandTotal: payload.amount // Simplified mock
        };
    }
};

export const mockCreditApi = {
    getAccountsList: async (outletId: string, filters?: any) => {
        await delay(300);
        let accounts = [...mockCreditAccounts]
            .filter(acc => acc.outletId === outletId)
            .map(acc => ({
                ...acc,
                customer: mockCustomers.find(c => c.id === acc.customerId) || acc.customer
            }));

        if (filters?.status && filters.status !== 'all') {
            accounts = accounts.filter(a => a.status === filters.status);
        }
        if (filters?.search) {
            const q = filters.search.toLowerCase();
            accounts = accounts.filter(a =>
                a.customer?.name.toLowerCase().includes(q) ||
                a.customer?.phone.includes(q)
            );
        }
        if (filters?.overdue) {
            accounts = accounts.filter(a => a.status === 'overdue');
        }
        return accounts.sort((a, b) => b.totalOutstanding - a.totalOutstanding);
    },

    list: async (outletId: string): Promise<CreditAccount[]> => {
        await delay(300);
        return mockCreditAccounts.filter(acc => acc.outletId === outletId);
    },

    getTransactions: async (accountId: string) => {
        await delay(200);
        return mockCreditTransactions
            .filter(t => t.creditAccountId === accountId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    getLedger: async (customerId: string): Promise<{ account: CreditAccount; transactions: CreditTransaction[] }> => {
        await delay(300);
        const account = mockCreditAccounts.find(acc => acc.customerId === customerId);
        if (!account) throw { error: { code: 'NOT_FOUND', message: "Account not found" } };
        const transactions = mockCreditTransactions.filter(tx => tx.customerId === customerId);
        return { account, transactions };
    },

    recordPayment: async (accountId: string, payload: any) => {
        await delay(400);
        const acc = mockCreditAccounts.find(a => a.id === accountId);
        if (!acc) throw { error: { code: 'NOT_FOUND', message: "Account not found" } };
        if (payload.amount > acc.totalOutstanding) {
            throw { error: { code: "OVERPAYMENT", message: `Amount exceeds outstanding ₹${acc.totalOutstanding}` } };
        }
        acc.totalOutstanding -= payload.amount;
        acc.totalRepaid += payload.amount;
        if (acc.totalOutstanding <= 0) acc.status = 'cleared';
        else if (acc.totalOutstanding < acc.totalBorrowed) acc.status = 'partial';
        mockCreditTransactions.push({
            id: `txn-${Date.now()}`,
            creditAccountId: acc.id,
            customerId: acc.customerId,
            type: 'credit',
            amount: payload.amount,
            description: `Payment via ${payload.mode ?? payload.paymentMode ?? 'cash'}`,
            balanceAfter: acc.totalOutstanding,
            recordedBy: 'system',
            createdAt: new Date().toISOString(),
        });
        return {
            success: true,
            newBalance: acc.totalOutstanding,
            message: "Payment recorded successfully"
        };
    },

    updateCreditLimit: async (accountId: string, newLimit: number) => {
        await delay(300);
        const acc = mockCreditAccounts.find(a => a.id === accountId);
        if (acc) acc.creditLimit = newLimit;
        return { success: true, newLimit };
    },

    getAgingSummary: async (outletId: string) => {
        await delay(250);
        const buckets = [
            { count: 2, amount: 1050 },
            { count: 1, amount: 3200 },
            { count: 1, amount: 2800 },
            { count: 1, amount: 1000 },
        ];
        return {
            current:      buckets[0],
            days30to60:   buckets[1],
            days60to90:   buckets[2],
            over90:       buckets[3],
            totalOverdue: { count: 3, amount: 7000 },
            totalOutstanding: buckets.reduce((s, b) => s + b.amount, 0),
        };
    },

    sendReminder: async (accountId: string): Promise<{ status: string }> => {
        await delay(300);
        return { status: "queued" };
    }
};

export const mockDashboardApi = {
    getDailySummary: async (outletId: string, date: string): Promise<DashboardKPI> => {
        await delay(300);
        return mockDashboardKPI;
    },
    getAlerts: async (outletId: string): Promise<DashboardAlerts> => {
        await delay(300);
        return mockAlertSummary;
    }
};

export const mockStaffApi = {
    list: async (outletId: string): Promise<StaffMember[]> => {
        await delay(300);
        return mockStaff.filter(s => s.outletId === outletId);
    },
    verifyPin: async (pin: string): Promise<StaffPinVerifyResponse> => {
        await delay(300);
        const staff = mockStaff.find(s => s.staffPin === pin);
        if (staff) {
            return {
                id: staff.id,
                name: staff.name,
                role: staff.role,
                staffPin: staff.staffPin,
                maxDiscount: staff.maxDiscount,
                canEditRate: staff.canEditRate,
                billsToday: 15, // Mock number
                totalSalesToday: 4500 // Mock number
            };
        }
        throw { error: { code: 'INVALID_PIN', message: "Invalid PIN" } };
    },
    getPerformance: async (staffId: string, from: string, to: string): Promise<StaffPerformance> => {
        await delay(300);
        return {
            billsCount: 156,
            totalSales: 45000,
            avgBillValue: 288,
            topSellingItems: [
                { name: "Dolo 650 Tablet", qty: 25, revenue: 800 }
            ],
            hourlyActivity: [
                { hour: 10, bills: 12, sales: 4000 }
            ]
        };
    },
    getLeaderboard: async (outletId: string, period: string) => {
        await delay(300);
        return mockStaff
            .filter(s => s.outletId === outletId)
            .slice(0, 3)
            .map(s => ({
                staffId: s.id,
                name: s.name,
                avatarUrl: s.avatarUrl,
                billsCount: Math.floor(Math.random() * 50),
                totalSales: Math.floor(Math.random() * 20000)
            }));
    }
};

export const mockInventoryApi = {
    getStock: async (outletId: string, filters: any) => {
        await delay(300);
        let products = [...mockProducts];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.composition.toLowerCase().includes(q) ||
                p.manufacturer.toLowerCase().includes(q)
            );
        }
        if (filters.scheduleType && filters.scheduleType !== 'all') {
            products = products.filter(p => p.scheduleType === filters.scheduleType);
        }
        if (filters.lowStock) {
            // Need to calculate lowStock properly - but we can rely on mockProducts isLowStock flag 
            // since search maps it properly. But mockProducts doesn't have isLowStock natively, 
            // the ProductSearchResult does.
            // Let's use mockProducts directly but fetch their batches for logic, or we can use 
            // mockProductsApi.search to get ProductSearchResult which has the computed logic.
            // Let's implement it here properly.
        }

        const enrichedProducts = products.map(p => {
             const pBatches = mockBatches.filter(b => b.outletProductId === p.id && b.outletId === outletId);
             const totalStock = pBatches.reduce((acc, curr) => acc + curr.qtyStrips, 0);
             return {
                 ...p,
                 outletProductId: p.id,
                 totalStock,
                 nearestExpiry: pBatches.length > 0 ? pBatches[0].expiryDate : "2099-12-31",
                 isLowStock: totalStock < 10,
                 batches: pBatches
             };
        });

        let filteredProducts = enrichedProducts;

        if (filters.lowStock) {
             filteredProducts = filteredProducts.filter(p => p.isLowStock);
        }
        if (filters.expiringSoon) {
            const cutoff = addDays(new Date(), 90);
            filteredProducts = filteredProducts.filter(p => new Date(p.nearestExpiry) <= cutoff);
        }

        // Sorting
        if (filters.sortBy) {
             filteredProducts.sort((a, b) => {
                  let valA: any = a[filters.sortBy as keyof typeof a];
                  let valB: any = b[filters.sortBy as keyof typeof b];

                  if (filters.sortBy === 'stock') {
                      valA = a.totalStock; valB = b.totalStock;
                  } else if (filters.sortBy === 'expiry') {
                      valA = new Date(a.nearestExpiry).getTime(); valB = new Date(b.nearestExpiry).getTime();
                  }

                  if (valA < valB) return filters.sortOrder === 'asc' ? -1 : 1;
                  if (valA > valB) return filters.sortOrder === 'asc' ? 1 : -1;
                  return 0;
             });
        }

        return {
            data: filteredProducts,
            pagination: {
                page: 1, pageSize: 50,
                totalPages: 1,
                totalRecords: filteredProducts.length
            }
        };
    },

    getBatches: async (productId: string, outletId: string) => {
        await delay(200);
        return mockBatches.filter(b => b.outletProductId === productId && b.outletId === outletId);
    },

    getExpiryReport: async (outletId: string, daysAhead: number) => {
        await delay(300);
        const cutoff = addDays(new Date(), daysAhead);
        const expiring: any[] = [];
        for (const product of mockProducts) {
            const productBatches = mockBatches.filter(b => b.outletProductId === product.id && b.outletId === outletId);
            for (const batch of productBatches) {
                if (new Date(batch.expiryDate) <= cutoff) {
                    expiring.push({
                        product,
                        batch,
                        daysRemaining: differenceInDays(new Date(batch.expiryDate), new Date())
                    });
                }
            }
        }
        return expiring.sort((a, b) => a.daysRemaining - b.daysRemaining);
    },

    getLowStock: async (outletId: string) => {
        await delay(300);
        const products = mockProducts.map(p => {
             const pBatches = mockBatches.filter(b => b.outletProductId === p.id && b.outletId === outletId);
             const totalStock = pBatches.reduce((acc, curr) => acc + curr.qtyStrips, 0);
             return {
                 ...p,
                 outletProductId: p.id,
                 totalStock,
                 nearestExpiry: pBatches.length > 0 ? pBatches[0].expiryDate : "2099-12-31",
                 isLowStock: totalStock < 10,
                 batches: pBatches
             };
        });
        return products.filter(p => p.isLowStock);
    },

    adjustStock: async (payload: any) => {
        await delay(400);
        return { success: true, message: `Stock adjusted by ${payload.qtyChange}` };
    }
};

export const mockPurchasesApi = {
    list: async (outletId: string, filters?: any) => {
        await delay(300);
        let invoices = [...mockPurchaseInvoices];
        if (filters?.distributorId) {
            invoices = invoices.filter(
                i => i.distributorId === filters.distributorId
            );
        }
        if (filters?.outstanding) {
            invoices = invoices.filter(i => i.outstanding > 0);
        }
        if (filters?.from) {
            invoices = invoices.filter(
                i => i.invoiceDate >= filters.from
            );
        }
        return {
            data: invoices.sort((a, b) =>
                b.invoiceDate.localeCompare(a.invoiceDate)
            ),
            pagination: { page: 1, pageSize: 50, totalPages: 1, total: invoices.length }
        };
    },

    getById: async (id: string) => {
        await delay(200);
        return mockPurchaseInvoices.find(i => i.id === id) ?? null;
    },

    create: async (payload: CreatePurchasePayload) => {
        await delay(500);
        if (!payload.items?.length) {
            throw { error: { code: 'EMPTY_ITEMS', message: 'At least one item required' } }
        }
        const dup = mockPurchaseInvoices.find(
            p => p.invoiceNo === payload.invoiceNo &&
                 p.outletId === payload.outletId
        )
        if (dup) throw { error: { code: 'DUPLICATE_INVOICE', message: `Invoice ${payload.invoiceNo} exists` } }
        const newInvoice: PurchaseInvoiceFull = {
            id: `purchase-${Date.now()}`,
            ...payload,
            godown: payload.godown ?? 'main',
            distributor: mockDistributors.find(d => d.id === payload.distributorId)!,
            subtotal: payload.items.reduce((s, i) => s + i.purchaseRate * i.qty, 0),
            discountAmount: 0,
            taxableAmount: payload.items.reduce((s, i) => s + i.taxableAmount, 0),
            gstAmount: payload.items.reduce((s, i) => s + i.gstAmount, 0),
            grandTotal: payload.items.reduce((s, i) => s + i.totalAmount, 0),
            amountPaid: 0,
            outstanding: payload.items.reduce((s, i) => s + i.totalAmount, 0),
            items: payload.items.map((item, idx) => ({
                id: `pi-${Date.now()}-${idx}`,
                purchaseId: `purchase-${Date.now()}`,
                ...item,
            })),
            createdByName: "Current User",
            createdAt: new Date().toISOString(),
        };
        mockPurchaseInvoices.unshift(newInvoice);
        return newInvoice;
    },

    createPurchase: async (payload: CreatePurchasePayload) => {
        await delay(600);
        const newInvoice = {
            id: `purchase-${Date.now()}`,
            createdAt: new Date().toISOString(),
            amountPaid: 0,
            outstanding: payload.grandTotal,
            createdByName: 'Mock User',
            ...payload,
        };
        mockPurchaseInvoices.unshift(newInvoice as any);
        return newInvoice;
    },

    recordPayment: async (purchaseId: string, amount: number) => {
        await delay(300);
        const invoice = mockPurchaseInvoices.find(i => i.id === purchaseId);
        if (invoice) {
            invoice.amountPaid += amount;
            invoice.outstanding -= amount;
        }
        return { success: true, message: "Payment recorded successfully" };
    },
};

export const mockDistributorsApi = {
    list: async (outletId: string) => {
        await delay(200);
        return mockDistributors;
    },

    getById: async (id: string) => {
        await delay(150);
        return mockDistributors.find(d => d.id === id) ?? null;
    },

    getLedger: async (distributorId: string) => {
        await delay(300);
        const entries: DistributorLedgerEntry[] = [
            {
                id: "1", date: "2026-02-26",
                type: "purchase",
                invoiceNo: "AJD-2026-0071",
                amount: 22000, balanceAfter: 22000,
                description: "Purchase invoice"
            },
            {
                id: "2", date: "2026-03-03",
                type: "purchase",
                invoiceNo: "AJD-2026-0089",
                amount: 12450, balanceAfter: 34450,
                description: "Purchase invoice"
            },
            {
                id: "3", date: "2026-03-03",
                type: "payment",
                invoiceNo: "AJD-2026-0089",
                amount: -12450, balanceAfter: 22000,
                description: "Payment via NEFT"
            },
            {
                id: "4", date: "2026-03-08",
                type: "purchase",
                invoiceNo: "AJD-2026-0102",
                amount: 8900, balanceAfter: 30900,
                description: "Purchase invoice"
            },
        ];
        return entries;
    },

    create: async (payload: any) => {
        await delay(400);
        return { id: `dist-${Date.now()}`, ...payload };
    },

    update: async (id: string, payload: any) => {
        await delay(400);
        return { id, ...payload };
    },
};

export const mockCustomersApi = {
    list: async (outletId: string, filters?: CustomerFilters) => {
        await delay(300);
        let customers = (mockCustomers as CustomerFull[]).filter(c => c.outletId === outletId && c.id !== 'customer-walkin');

        if (filters?.search) {
            const q = filters.search.toLowerCase();
            customers = customers.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.phone.includes(q) ||
                c.address?.toLowerCase().includes(q)
            );
        }
        if (filters?.isChronic) {
            customers = customers.filter(c => c.isChronic);
        }
        if (filters?.hasOutstanding) {
            customers = customers.filter(c => c.outstanding > 0);
        }

        const sortBy = filters?.sortBy ?? 'name';
        customers.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'totalPurchases') return b.totalPurchases - a.totalPurchases;
            if (sortBy === 'outstanding') return b.outstanding - a.outstanding;
            if (sortBy === 'nextRefill') {
                const aDate = a.nextRefillDue ? new Date(a.nextRefillDue).getTime() : Infinity;
                const bDate = b.nextRefillDue ? new Date(b.nextRefillDue).getTime() : Infinity;
                return aDate - bDate;
            }
            return 0;
        });

        return {
            data: customers,
            pagination: { page: 1, pageSize: 50, totalPages: 1, totalRecords: customers.length }
        };
    },

    getById: async (id: string): Promise<CustomerFull | null> => {
        await delay(200);
        return (mockCustomers as CustomerFull[]).find(c => c.id === id) ?? null;
    },

    getPurchaseHistory: async (customerId: string): Promise<CustomerPurchaseSummary[]> => {
        await delay(250);
        return (mockPurchaseHistory as Record<string, CustomerPurchaseSummary[]>)[customerId] ?? [];
    },

    getRefillAlerts: async (outletId: string) => {
        await delay(300);
        const today = new Date();
        return (mockCustomers as CustomerFull[])
            .filter(c => c.isChronic && c.nextRefillDue && c.outletId === outletId)
            .map(c => ({
                customer: c,
                medicines: c.regularMedicines ?? [],
                daysOverdue: differenceInDays(today, new Date(c.nextRefillDue!)),
                nextRefillDue: c.nextRefillDue!,
            }))
            .filter(a => a.daysOverdue >= -7)
            .sort((a, b) => b.daysOverdue - a.daysOverdue);
    },

    create: async (payload: any): Promise<CustomerFull> => {
        await delay(400);
        return {
            id: `cust-${Date.now()}`,
            outletId: payload.outletId,
            outstanding: 0,
            totalPurchases: 0,
            totalVisits: 0,
            allergies: [],
            chronicConditions: [],
            regularMedicines: [],
            createdAt: new Date().toISOString(),
            ...payload,
        };
    },

    update: async (id: string, payload: any): Promise<CustomerFull> => {
        await delay(400);
        const existing = (mockCustomers as CustomerFull[]).find(c => c.id === id);
        return { ...existing!, ...payload };
    },

    getDoctors: async (_outletId: string) => {
        await delay(200);
        return mockDoctors;
    },
};

export const mockAttendanceApi = {
    getMonthlyRecords: async (filter: MonthlyAttendanceFilter): Promise<AttendanceRecord[]> => {
        await delay(300);
        return mockAttendanceRecords.filter(r => {
            const d = new Date(r.date);
            const matchMonth = d.getMonth() + 1 === filter.month;
            const matchYear = d.getFullYear() === filter.year;
            const matchStaff = filter.staffId ? r.staffId === filter.staffId : true;
            return matchMonth && matchYear && matchStaff;
        });
    },

    getTodayRecords: async (outletId: string): Promise<AttendanceRecord[]> => {
        await delay(200);
        const today = format(new Date(), 'yyyy-MM-dd');
        return mockAttendanceRecords.filter(
            r => r.date === today && r.outletId === outletId
        );
    },

    getMonthlySummaries: async (
        _outletId: string,
        month: number,
        year: number
    ): Promise<AttendanceSummary[]> => {
        await delay(300);
        return mockAttendanceSummaries.filter(
            s => s.month === month && s.year === year
        );
    },

    checkIn: async (payload: KioskCheckPayload): Promise<AttendanceRecord> => {
        await delay(400);
        const today = format(new Date(), 'yyyy-MM-dd');
        const existing = mockAttendanceRecords.find(
            r => r.staffId === payload.staffId && r.date === today
        );
        if (existing?.checkInTime) {
            throw { error: { code: 'ALREADY_CHECKED_IN', message: 'Already checked in today' } };
        }
        const staff = mockStaff.find(s => s.id === payload.staffId);
        const now = new Date();
        const checkInTime = format(now, 'HH:mm:ss');
        const shiftStart = STAFF_SHIFT_START[payload.staffId] ?? '09:00';
        const [sh, sm] = shiftStart.split(':').map(Number);
        const shiftStartMins = sh * 60 + sm + 10; // grace
        const [ch, cm] = checkInTime.split(':').map(Number);
        const checkInMins = ch * 60 + cm;
        const isLate = checkInMins > shiftStartMins;
        const lateByMinutes = isLate ? (checkInMins - (sh * 60 + sm)) : 0;

        const record: AttendanceRecord = {
            id: `att-${Date.now()}`,
            staffId: payload.staffId,
            staff,
            date: today,
            checkInTime,
            status: isLate ? 'late' : 'present',
            isLate,
            lateByMinutes: lateByMinutes > 0 ? lateByMinutes : undefined,
            checkInPhoto: payload.photoBase64,
            outletId: payload.outletId,
        };
        mockAttendanceRecords.push(record);
        return record;
    },

    checkOut: async (payload: KioskCheckPayload): Promise<AttendanceRecord> => {
        await delay(400);
        const today = format(new Date(), 'yyyy-MM-dd');
        const existing = mockAttendanceRecords.find(
            r => r.staffId === payload.staffId && r.date === today
        );
        if (!existing) {
            throw { error: { code: 'NOT_CHECKED_IN', message: 'No check-in record found for today' } };
        }
        if (existing.checkOutTime) {
            throw { error: { code: 'ALREADY_CHECKED_OUT', message: 'Already checked out today' } };
        }
        const checkOutTime = format(new Date(), 'HH:mm:ss');
        const [ih, im] = existing.checkInTime!.split(':').map(Number);
        const [oh, om] = checkOutTime.split(':').map(Number);
        const workingHours = parseFloat(((oh * 60 + om - ih * 60 - im) / 60).toFixed(2));

        existing.checkOutTime = checkOutTime;
        existing.checkOutPhoto = payload.photoBase64;
        existing.workingHours = workingHours;
        return { ...existing };
    },

    markManual: async (payload: {
        staffId: string;
        date: string;
        status: AttendanceStatus;
        checkInTime?: string;
        checkOutTime?: string;
        notes?: string;
        markedBy: string;
    }): Promise<AttendanceRecord> => {
        await delay(350);
        const staff = mockStaff.find(s => s.id === payload.staffId);
        const workingHours =
            payload.checkInTime && payload.checkOutTime
                ? (() => {
                    const [ih, im] = payload.checkInTime.split(':').map(Number);
                    const [oh, om] = payload.checkOutTime.split(':').map(Number);
                    return parseFloat(((oh * 60 + om - ih * 60 - im) / 60).toFixed(2));
                })()
                : undefined;
        const record: AttendanceRecord = {
            id: `att-manual-${Date.now()}`,
            staffId: payload.staffId,
            staff,
            date: payload.date,
            status: payload.status,
            isLate: false,
            checkInTime: payload.checkInTime,
            checkOutTime: payload.checkOutTime,
            workingHours,
            notes: payload.notes,
            markedBy: payload.markedBy,
            outletId: 'outlet-001',
        };
        // Replace or push
        const idx = mockAttendanceRecords.findIndex(
            r => r.staffId === payload.staffId && r.date === payload.date
        );
        if (idx >= 0) {
            mockAttendanceRecords[idx] = record;
        } else {
            mockAttendanceRecords.push(record);
        }
        return record;
    },
};

export const mockReportsApi = {
    getSalesReport: async (
        _outletId: string,
        dateRange: DateRangeFilter
    ): Promise<{
        rows: SalesReportRow[]
        summary: ReportSummaryCard[]
        chartData: { date: string; sales: number; bills: number }[]
    }> => {
        await delay(400);
        // Combine current and previous month data for filtering
        const allData = [...mockSalesReportFeb2026, ...mockSalesReportData];
        const rows = allData.filter(
            r => r.date >= dateRange.from && r.date <= dateRange.to
        );
        const totalSales = rows.reduce((s, r) => s + r.totalSales, 0);
        const totalBills = rows.reduce((s, r) => s + r.invoiceCount, 0);
        const totalDiscount = rows.reduce((s, r) => s + r.totalDiscount, 0);
        const totalTax = rows.reduce((s, r) => s + r.totalTax, 0);

        const summary: ReportSummaryCard[] = [
            {
                label: 'Total Sales',
                value: formatCurrency(totalSales),
                change: 9.3,
                trend: 'up',
                changeLabel: 'vs last month',
            },
            {
                label: 'Total Bills',
                value: totalBills.toString(),
                change: 7.1,
                trend: 'up',
            },
            {
                label: 'Avg Bill Value',
                value: formatCurrency(totalBills > 0 ? totalSales / totalBills : 0),
                change: 2.0,
                trend: 'up',
            },
            {
                label: 'GST Collected',
                value: formatCurrency(totalTax),
                trend: 'flat',
            },
            {
                label: 'Total Discount',
                value: formatCurrency(totalDiscount),
                change: -3.2,
                trend: 'down',
                color: 'green',
            },
        ];
        return {
            rows,
            summary,
            chartData: rows.map(r => ({
                date: r.date,
                sales: r.totalSales,
                bills: r.invoiceCount,
            })),
        };
    },

    getGSTReport: async (
        _outletId: string,
        _dateRange: DateRangeFilter
    ): Promise<GSTSummary> => {
        await delay(350);
        return mockGSTSummary;
    },

    getStockValuation: async (
        _outletId: string
    ): Promise<{
        rows: StockValuationRow[]
        totalStockValue: number
        totalMrpValue: number
        potentialMarginPct: number
    }> => {
        await delay(400);
        const totalStockValue = mockStockValuation.reduce((s, r) => s + r.stockValue, 0);
        const totalMrpValue = mockStockValuation.reduce((s, r) => s + r.mrpValue, 0);
        return {
            rows: mockStockValuation,
            totalStockValue,
            totalMrpValue,
            potentialMarginPct: parseFloat(
                ((totalMrpValue - totalStockValue) / totalStockValue * 100).toFixed(1)
            ),
        };
    },

    getExpiryReport: async (
        _outletId: string
    ): Promise<ExpiryReportRow[]> => {
        await delay(300);
        return [...mockExpiryReport].sort((a, b) => a.daysRemaining - b.daysRemaining);
    },

    getStaffReport: async (
        _outletId: string,
        _dateRange: DateRangeFilter
    ): Promise<StaffReportRow[]> => {
        await delay(350);
        return mockStaffReport;
    },

    getPurchaseReport: async (
        _outletId: string,
        dateRange: DateRangeFilter
    ): Promise<{
        rows: PurchaseReportRow[]
        totalPurchased: number
        totalOutstanding: number
        totalPaid: number
    }> => {
        await delay(300);
        const rows = mockPurchaseReport.filter(
            r => r.date >= dateRange.from && r.date <= dateRange.to
        );
        return {
            rows,
            totalPurchased: rows.reduce((s, r) => s + r.grandTotal, 0),
            totalOutstanding: rows.reduce((s, r) => s + r.outstanding, 0),
            totalPaid: rows.reduce((s, r) => s + r.amountPaid, 0),
        };
    },
};

// ─── In-memory store for accounts (supplements localStorage in the hooks) ─────
let _runtimePayments: PaymentEntry[] = [...mockPaymentEntries];
let _runtimeReceipts: ReceiptEntry[] = [];
let _runtimeExpenses: ExpenseEntry[] = [...mockExpenseEntries];

export const mockAccountsApi = {

    // ── Outstanding ─────────────────────────────────────────────────────────

    getDistributorOutstanding: async (_outletId: string): Promise<DistributorOutstanding[]> => {
        await delay(400);
        const today = new Date().toISOString().split('T')[0];
        const map = new Map<string, DistributorOutstanding>();

        for (const inv of mockPurchaseInvoices) {
            if (!map.has(inv.distributorId)) {
                const dist = mockDistributors.find(d => d.id === inv.distributorId);
                map.set(inv.distributorId, {
                    distributorId: inv.distributorId,
                    name: dist?.name ?? inv.distributorId,
                    gstin: dist?.gstin,
                    phone: dist?.phone,
                    totalBills: 0,
                    paidBills: 0,
                    overdueBills: 0,
                    totalOutstanding: 0,
                    overdueAmount: 0,
                    oldestDueDate: undefined,
                });
            }
            const entry = map.get(inv.distributorId)!;
            entry.totalBills++;
            if (inv.outstanding <= 0) {
                entry.paidBills++;
            } else {
                entry.totalOutstanding += inv.outstanding;
                const isOverdue = inv.dueDate && inv.dueDate < today;
                if (isOverdue) {
                    entry.overdueBills++;
                    entry.overdueAmount += inv.outstanding;
                    if (!entry.oldestDueDate || inv.dueDate! < entry.oldestDueDate) {
                        entry.oldestDueDate = inv.dueDate;
                    }
                }
            }
        }

        return Array.from(map.values()).filter(e => e.totalOutstanding > 0 || e.totalBills > 0);
    },

    getCustomerOutstanding: async (_outletId: string): Promise<CustomerOutstanding[]> => {
        await delay(300);
        return [...mockCustomerOutstanding];
    },

    getUnpaidInvoices: async (distributorId: string) => {
        await delay(300);
        return mockPurchaseInvoices.filter(
            inv => inv.distributorId === distributorId && inv.outstanding > 0
        );
    },

    // ── Payments ────────────────────────────────────────────────────────────

    createPayment: async (outletId: string, payload: CreatePaymentPayload, createdBy: string): Promise<PaymentEntry> => {
        await delay(600);
        const dist = mockDistributors.find(d => d.id === payload.distributorId);
        const entry: PaymentEntry = {
            id: `pmt-${Date.now()}`,
            outletId,
            distributorId: payload.distributorId,
            distributor: dist,
            date: payload.date,
            totalAmount: payload.totalAmount,
            paymentMode: payload.paymentMode,
            referenceNo: payload.referenceNo,
            notes: payload.notes,
            allocations: payload.allocations.map(a => {
                const inv = mockPurchaseInvoices.find(i => i.id === a.purchaseInvoiceId);
                return {
                    purchaseInvoiceId: a.purchaseInvoiceId,
                    invoiceNo: inv?.invoiceNo ?? a.purchaseInvoiceId,
                    invoiceDate: inv?.invoiceDate ?? '',
                    invoiceTotal: inv?.grandTotal ?? 0,
                    currentOutstanding: inv?.outstanding ?? 0,
                    allocatedAmount: a.allocatedAmount,
                };
            }),
            createdBy,
            createdAt: new Date().toISOString(),
        };
        // Update invoice outstanding
        for (const alloc of payload.allocations) {
            const inv = mockPurchaseInvoices.find(i => i.id === alloc.purchaseInvoiceId);
            if (inv) {
                inv.outstanding = Math.max(0, inv.outstanding - alloc.allocatedAmount);
                inv.amountPaid += alloc.allocatedAmount;
            }
        }
        _runtimePayments.unshift(entry);
        return entry;
    },

    getPayments: async (outletId: string, distributorId?: string): Promise<PaymentEntry[]> => {
        await delay(300);
        return _runtimePayments.filter(p =>
            p.outletId === outletId &&
            (distributorId ? p.distributorId === distributorId : true)
        );
    },

    // ── Receipts ────────────────────────────────────────────────────────────

    createReceipt: async (outletId: string, payload: CreateReceiptPayload, createdBy: string): Promise<ReceiptEntry> => {
        await delay(600);
        const entry: ReceiptEntry = {
            id: `rct-${Date.now()}`,
            outletId,
            customerId: payload.customerId,
            date: payload.date,
            totalAmount: payload.totalAmount,
            paymentMode: payload.paymentMode,
            referenceNo: payload.referenceNo,
            notes: payload.notes,
            allocations: payload.allocations.map(a => ({
                saleInvoiceId: a.saleInvoiceId,
                invoiceNo: a.saleInvoiceId,
                invoiceDate: '',
                invoiceTotal: 0,
                currentOutstanding: 0,
                allocatedAmount: a.allocatedAmount,
            })),
            createdBy,
            createdAt: new Date().toISOString(),
        };
        // Reduce customer outstanding
        const cust = mockCustomerOutstanding.find(c => c.customerId === payload.customerId);
        if (cust) {
            cust.totalOutstanding = Math.max(0, cust.totalOutstanding - payload.totalAmount);
            cust.overdueAmount = Math.max(0, cust.overdueAmount - payload.totalAmount);
        }
        _runtimeReceipts.unshift(entry);
        return entry;
    },

    getReceipts: async (outletId: string, customerId?: string): Promise<ReceiptEntry[]> => {
        await delay(300);
        return _runtimeReceipts.filter(r =>
            r.outletId === outletId &&
            (customerId ? r.customerId === customerId : true)
        );
    },

    // ── Expenses ────────────────────────────────────────────────────────────

    getExpenses: async (outletId: string, filters?: { from?: string; to?: string; head?: string }): Promise<ExpenseEntry[]> => {
        await delay(300);
        let entries = _runtimeExpenses.filter(e => e.outletId === outletId);
        if (filters?.from) entries = entries.filter(e => e.date >= filters.from!);
        if (filters?.to)   entries = entries.filter(e => e.date <= filters.to!);
        if (filters?.head) entries = entries.filter(e => e.expenseHead === filters.head);
        return entries.sort((a, b) => b.date.localeCompare(a.date));
    },

    createExpense: async (outletId: string, payload: CreateExpensePayload, createdBy: string): Promise<ExpenseEntry> => {
        await delay(600);
        const entry: ExpenseEntry = {
            id: `exp-${Date.now()}`,
            outletId,
            date: payload.date,
            expenseHead: payload.expenseHead,
            customHead: payload.customHead,
            amount: payload.amount,
            paymentMode: payload.paymentMode,
            notes: payload.notes,
            createdBy,
            createdAt: new Date().toISOString(),
        };
        _runtimeExpenses.unshift(entry);
        return entry;
    },

    // ── Ledger ──────────────────────────────────────────────────────────────

    getDistributorLedger: async (distributorId: string): Promise<{ openingBalance: number; entries: LedgerEntry[]; closingBalance: number }> => {
        await delay(400);
        const purchases = mockPurchaseInvoices
            .filter(inv => inv.distributorId === distributorId)
            .sort((a, b) => a.invoiceDate.localeCompare(b.invoiceDate));

        const payments = _runtimePayments
            .filter(p => p.distributorId === distributorId)
            .sort((a, b) => a.date.localeCompare(b.date));

        const allEvents: { date: string; type: 'purchase' | 'payment'; ref: any }[] = [
            ...purchases.map(p => ({ date: p.invoiceDate, type: 'purchase' as const, ref: p })),
            ...payments.map(p => ({ date: p.date, type: 'payment' as const, ref: p })),
        ].sort((a, b) => a.date.localeCompare(b.date));

        const openingBalance = 0;
        let runningBalance = openingBalance;
        const entries: LedgerEntry[] = allEvents.map((ev, idx) => {
            if (ev.type === 'purchase') {
                runningBalance += ev.ref.grandTotal;
                return {
                    id: `le-${idx}`,
                    date: ev.date,
                    entryType: 'purchase' as const,
                    referenceNo: ev.ref.invoiceNo,
                    description: `Purchase Invoice ${ev.ref.invoiceNo}`,
                    debit: ev.ref.grandTotal,
                    credit: 0,
                    balance: runningBalance,
                };
            } else {
                runningBalance -= ev.ref.totalAmount;
                return {
                    id: `le-${idx}`,
                    date: ev.date,
                    entryType: 'payment' as const,
                    referenceNo: ev.ref.referenceNo ?? ev.ref.id,
                    description: `Payment via ${ev.ref.paymentMode}`,
                    debit: 0,
                    credit: ev.ref.totalAmount,
                    balance: runningBalance,
                };
            }
        });

        return { openingBalance, entries, closingBalance: runningBalance };
    },

    getCustomerLedger: async (customerId: string): Promise<{ openingBalance: number; entries: LedgerEntry[]; closingBalance: number }> => {
        await delay(400);
        const receipts = _runtimeReceipts
            .filter(r => r.customerId === customerId)
            .sort((a, b) => a.date.localeCompare(b.date));

        const custOut = mockCustomerOutstanding.find(c => c.customerId === customerId);
        const openingBalance = custOut?.totalOutstanding ?? 0;
        let runningBalance = openingBalance;

        const entries: LedgerEntry[] = receipts.map((r, idx) => {
            runningBalance -= r.totalAmount;
            return {
                id: `cle-${idx}`,
                date: r.date,
                entryType: 'receipt' as const,
                referenceNo: r.referenceNo ?? r.id,
                description: `Receipt via ${r.paymentMode}`,
                debit: 0,
                credit: r.totalAmount,
                balance: runningBalance,
            };
        });

        return { openingBalance, entries, closingBalance: runningBalance };
    },
};
