import { addDays, differenceInDays } from 'date-fns';
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
    CustomerPurchaseSummary
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
    mockPurchaseHistory
} from '../mock';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthApi = {
    login: async (phone: string, password: string): Promise<AuthResponse> => {
        await delay(300);
        console.log("Mock login attempt:", { phone, password });
        try {
            if (phone.trim() === "9876543210" && password.trim() === "password123") {
                let rajesh = mockStaff?.find(s => s.name === "Rajesh Patil");
                
                // Fallback in case of strange circular import breakages where mockStaff is undefined
                if (!rajesh) {
                    console.log("mockStaff array was empty/undefined, using fallback inline user");
                    rajesh = {
                        id: "staff-001",
                        outletId: "outlet-001",
                        name: "Rajesh Patil",
                        phone: "9876543210",
                        role: "super_admin",
                        staffPin: "0000",
                        maxDiscount: 30,
                        canEditRate: true,
                        canViewPurchaseRates: true,
                        canCreatePurchases: true,
                        canAccessReports: true,
                        isActive: true,
                        joiningDate: "2024-01-01T00:00:00Z"
                    };
                }

                return {
                    access: "mock_access_token",
                    refresh: "mock_refresh_token",
                    user: {
                        id: rajesh.id,
                        name: rajesh.name,
                        phone: rajesh.phone,
                        role: rajesh.role,
                        staffPin: rajesh.staffPin,
                        outletId: rajesh.outletId,
                        outlet: {
                            id: rajesh.outletId,
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
                        maxDiscount: rajesh.maxDiscount,
                        canEditRate: rajesh.canEditRate,
                        canViewPurchaseRates: rajesh.canViewPurchaseRates,
                        canCreatePurchases: rajesh.canCreatePurchases,
                        canAccessReports: rajesh.canAccessReports
                    }
                };
            }
            throw { error: { code: 'AUTH_FAILED', message: "Invalid credentials" } };
        } catch (e: any) {
            console.error("Login verification crashed:", e);
            throw e; // Rethrow so frontend catches it properly
        }
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
        return {
            current:      { count: 2, amount: 1050 },
            days30to60:   { count: 1, amount: 3200 },
            days60to90:   { count: 1, amount: 2800 },
            over90:       { count: 1, amount: 1000 },
            totalOverdue: { count: 3, amount: 7000 },
            totalOutstanding: { count: 5, amount: 8550 }
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
            pagination: { page: 1, pageSize: 50, totalPages: 1, totalRecords: invoices.length }
        };
    },

    getById: async (id: string) => {
        await delay(200);
        return mockPurchaseInvoices.find(i => i.id === id) ?? null;
    },

    create: async (payload: CreatePurchasePayload) => {
        await delay(500);
        const newInvoice: PurchaseInvoiceFull = {
            id: `purchase-${Date.now()}`,
            ...payload,
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
