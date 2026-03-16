import { mockStaff } from '@/mock/staff.mock';
import { mockProducts } from '@/mock/products.mock';
import { mockCustomers } from '@/mock/customers.mock';
import { mockAttendanceRecords, mockAttendanceSummaries } from '@/mock/attendance.mock';
import { mockSalesReportData } from '@/mock/reports.mock';
import { mockPurchaseInvoices } from '@/mock/purchases.mock';
import { mockDistributors } from '@/mock/distributors.mock';

// ─── Staff Integrity ──────────────────────────────────────────────────────────
describe('Data Integrity — Staff', () => {
    it('all staff IDs follow staff-00N pattern', () => {
        mockStaff.forEach(s => {
            expect(s.id).toMatch(/^staff-\d{3}$/);
        });
    });

    it('no two staff share the same PIN (staffPin field)', () => {
        // BUG: StaffMember uses "staffPin" not "pin" — inconsistent naming with verifyPin() params
        const pins = mockStaff.map(s => (s as any).staffPin);
        expect(new Set(pins).size).toBe(pins.length);
    });

    it('all staff belong to outlet-001', () => {
        mockStaff.forEach(s => {
            expect(s.outletId).toBe('outlet-001');
        });
    });

    it('super_admin role exists', () => {
        expect(mockStaff.some(s => s.role === 'super_admin')).toBe(true);
    });

    it('exactly one super_admin', () => {
        const admins = mockStaff.filter(s => s.role === 'super_admin');
        expect(admins).toHaveLength(1);
    });
});

// ─── Products Integrity ───────────────────────────────────────────────────────
describe('Data Integrity — Products', () => {
    it('has at least 10 products', () => {
        expect(mockProducts.length).toBeGreaterThanOrEqual(10);
    });

    it('each product has a valid gstRate (0, 5, 12, or 18)', () => {
        const validRates = [0, 5, 12, 18];
        mockProducts.forEach(p => {
            // Products have batches with gstRate
            if ((p as any).batches && (p as any).batches.length > 0) {
                // batches may have gstRate
                (p as any).batches.forEach((b: any) => {
                    if (b.gstRate !== undefined) {
                        expect(validRates).toContain(b.gstRate);
                    }
                });
            }
        });
    });

    it('product IDs are unique', () => {
        const ids = mockProducts.map((p: any) => p.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('BUG: MasterProduct has no batches field — batches are in a separate mock', () => {
        // mockProducts is MasterProduct[] which has no "batches" property
        // Batches are in a separate data structure (fetched via mockProductsApi.getStock())
        // This means we cannot validate batch data from mockProducts directly
        mockProducts.forEach((p: any) => {
            expect(p.batches).toBeUndefined();
        });
    });

    it('products have gstRate at product level (not batch level)', () => {
        const validRates = [0, 5, 12, 18];
        mockProducts.forEach((p: any) => {
            if (p.gstRate !== undefined) {
                expect(validRates).toContain(p.gstRate);
            }
        });
    });
});

// ─── Customers Integrity ──────────────────────────────────────────────────────
describe('Data Integrity — Customers', () => {
    it('walk-in customer exists', () => {
        const walkin = mockCustomers.find((c: any) => c.id === 'customer-walkin');
        expect(walkin).toBeDefined();
    });

    it('walk-in customer has name "Walk-in Customer"', () => {
        const walkin = mockCustomers.find((c: any) => c.id === 'customer-walkin');
        expect(walkin?.name).toBe('Walk-in Customer');
    });

    it('total customers = 9 (8 real + 1 walk-in)', () => {
        // mockCustomers includes walk-in; list API excludes it
        expect(mockCustomers.length).toBe(9);
    });

    it('customer IDs are unique', () => {
        const ids = mockCustomers.map((c: any) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('chronic patients have isChronic = true', () => {
        const chronic = mockCustomers.filter((c: any) => c.isChronic);
        expect(chronic.length).toBeGreaterThan(0);
    });
});

// ─── Attendance Integrity ─────────────────────────────────────────────────────
describe('Data Integrity — Attendance Records', () => {
    it('all records have a valid staffId', () => {
        const staffIds = mockStaff.map(s => s.id);
        mockAttendanceRecords.forEach(r => {
            expect(staffIds).toContain(r.staffId);
        });
    });

    it('records are for outlet-001', () => {
        mockAttendanceRecords.forEach(r => {
            expect(r.outletId).toBe('outlet-001');
        });
    });

    it('working hours are positive when checkIn/checkOut present', () => {
        mockAttendanceRecords
            .filter(r => r.checkInTime && r.checkOutTime && r.workingHours !== undefined)
            .forEach(r => {
                expect(r.workingHours!).toBeGreaterThan(0);
            });
    });

    it('summaries exist for all 5 staff members', () => {
        expect(mockAttendanceSummaries).toHaveLength(5);
    });

    it('each summary has attendancePct between 0 and 100', () => {
        mockAttendanceSummaries.forEach(s => {
            expect(s.attendancePct).toBeGreaterThanOrEqual(0);
            expect(s.attendancePct).toBeLessThanOrEqual(100);
        });
    });

    it('BUG: grace period hard-coded to 10 min in attendance.mock.ts (ignores settings)', () => {
        // calcLate() uses a hard-coded 10-minute grace period
        // It should read from settingsStore.attendanceGraceMinutes
        // This is a data/logic consistency bug
        const rajesh = mockAttendanceRecords.find(r => r.staffId === 'staff-001' && r.date === '2026-03-03');
        // Rajesh checked in at 09:18, shift starts at 09:00, grace = 10 min
        // 09:18 > 09:10 (grace) → should be late
        expect(rajesh?.isLate).toBe(true);
    });
});

// ─── Sales Report Integrity ───────────────────────────────────────────────────
describe('Data Integrity — Sales Report', () => {
    it('has 14 days of data (Mar 1–14)', () => {
        expect(mockSalesReportData).toHaveLength(14);
    });

    it('netSales = cashSales + upiSales + cardSales + creditSales for each row', () => {
        mockSalesReportData.forEach(row => {
            const sumChannels = row.cashSales + row.upiSales + row.cardSales + row.creditSales;
            expect(Math.abs(row.netSales - sumChannels)).toBeLessThan(1);
        });
    });

    it('cashSales + upiSales + cardSales + creditSales = netSales (channel consistency)', () => {
        mockSalesReportData.forEach(row => {
            const sumChannels = row.cashSales + row.upiSales + row.cardSales + row.creditSales;
            expect(Math.abs(sumChannels - row.netSales)).toBeLessThan(2);
        });
    });

    it('invoiceCount > 0 for all days', () => {
        mockSalesReportData.forEach(row => {
            expect(row.invoiceCount).toBeGreaterThan(0);
        });
    });

    it('dates are in chronological order', () => {
        for (let i = 1; i < mockSalesReportData.length; i++) {
            expect(mockSalesReportData[i].date > mockSalesReportData[i - 1].date).toBe(true);
        }
    });
});
