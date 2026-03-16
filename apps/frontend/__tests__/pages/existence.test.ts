import * as fs from 'fs';
import * as path from 'path';

const appDir = path.join(__dirname, '../../app');
const componentsDir = path.join(__dirname, '../../components');
const hooksDir = path.join(__dirname, '../../hooks');
const libDir = path.join(__dirname, '../../lib');
const storeDir = path.join(__dirname, '../../store');

function fileExists(filePath: string): boolean {
    try {
        return fs.existsSync(filePath);
    } catch {
        return false;
    }
}

// ─── Dashboard Pages ──────────────────────────────────────────────────────────
describe('Page Files — Existence', () => {
    const pages = [
        'dashboard/page.tsx',
        'dashboard/billing/page.tsx',
        'dashboard/inventory/page.tsx',
        'dashboard/purchases/page.tsx',
        'dashboard/credit/page.tsx',
        'dashboard/customers/page.tsx',
        'dashboard/staff/page.tsx',
        'dashboard/attendance/page.tsx',
        'dashboard/reports/page.tsx',
        'dashboard/settings/page.tsx',
    ];

    pages.forEach(page => {
        it(`EXISTS: app/${page}`, () => {
            expect(fileExists(path.join(appDir, page))).toBe(true);
        });
    });
});

// ─── Layout and Auth Pages ────────────────────────────────────────────────────
describe('Layout Files — Existence', () => {
    it('EXISTS: app/layout.tsx', () => {
        expect(fileExists(path.join(appDir, 'layout.tsx'))).toBe(true);
    });

    it('EXISTS: app/dashboard/layout.tsx', () => {
        expect(fileExists(path.join(appDir, 'dashboard/layout.tsx'))).toBe(true);
    });

    it('EXISTS: app/page.tsx (root)', () => {
        expect(fileExists(path.join(appDir, 'page.tsx'))).toBe(true);
    });
});

// ─── Store Files ──────────────────────────────────────────────────────────────
describe('Store Files — Existence', () => {
    const stores = [
        'authStore.ts',
        'billingStore.ts',
        'settingsStore.ts',
    ];

    stores.forEach(store => {
        it(`EXISTS: store/${store}`, () => {
            expect(fileExists(path.join(storeDir, store))).toBe(true);
        });
    });
});

// ─── Lib Files ────────────────────────────────────────────────────────────────
describe('Lib Files — Existence', () => {
    const libFiles = [
        'apiClient.ts',
        'mockApi.ts',
        'gst.ts',
        'utils.ts',
        'validations/attendance.ts',
        'validations/settings.ts',
        'validations/billing.ts',
        'validations/purchases.ts',
    ];

    libFiles.forEach(file => {
        it(`EXISTS: lib/${file}`, () => {
            expect(fileExists(path.join(libDir, file))).toBe(true);
        });
    });

    it('lib/validations/staff.ts exists', () => {
        expect(fileExists(path.join(libDir, 'validations/staff.ts'))).toBe(true);
    });
});

// ─── Attendance Components ────────────────────────────────────────────────────
describe('Attendance Components — Existence', () => {
    const attendanceComponents = [
        'AttendanceTodaySummary.tsx',
        'TodayAttendanceTab.tsx',
        'MonthlyAttendanceTab.tsx',
        'AttendanceSummaryTab.tsx',
        'ManualAttendanceModal.tsx',
        'KioskMode.tsx',
    ];

    attendanceComponents.forEach(comp => {
        it(`EXISTS: components/attendance/${comp}`, () => {
            expect(fileExists(path.join(componentsDir, 'attendance', comp))).toBe(true);
        });
    });
});

// ─── Settings Components ──────────────────────────────────────────────────────
describe('Settings Components — Existence', () => {
    const settingsComponents = [
        'SettingsSectionHeader.tsx',
        'SettingsToggleRow.tsx',
        'SettingsSidebar.tsx',
        'OutletSettingsSection.tsx',
        'GSTSettingsSection.tsx',
        'PrinterSettingsSection.tsx',
        'BillingSettingsSection.tsx',
        'AttendanceSettingsSection.tsx',
        'NotificationsSection.tsx',
        'PreferencesSection.tsx',
        'DataManagementSection.tsx',
    ];

    settingsComponents.forEach(comp => {
        it(`EXISTS: components/settings/${comp}`, () => {
            expect(fileExists(path.join(componentsDir, 'settings', comp))).toBe(true);
        });
    });
});

// ─── Reports Components ───────────────────────────────────────────────────────
describe('Reports Components — Existence', () => {
    const reportComponents = [
        'SalesReportTab.tsx',
        'GSTReportTab.tsx',
        'StockValuationTab.tsx',
        'ExpiryReportTab.tsx',
        'StaffReportTab.tsx',
        'PurchaseReportTab.tsx',
    ];

    reportComponents.forEach(comp => {
        it(`EXISTS: components/reports/${comp}`, () => {
            const exists = fileExists(path.join(componentsDir, 'reports', comp));
            if (!exists) {
                console.warn(`MISSING: components/reports/${comp}`);
            }
            expect(exists).toBe(true);
        });
    });
});

// ─── Hooks ────────────────────────────────────────────────────────────────────
describe('Hooks — Existence', () => {
    const hooks = [
        'useAttendance.ts',
        'useReports.ts',
        'useOutletId.ts',
        'usePermissions.ts',
        'use-toast.ts',
    ];

    hooks.forEach(hook => {
        it(`EXISTS: hooks/${hook}`, () => {
            expect(fileExists(path.join(hooksDir, hook))).toBe(true);
        });
    });
});

// ─── Next.js Config ───────────────────────────────────────────────────────────
describe('Config Files — Existence', () => {
    const frontendRoot = path.join(__dirname, '../..');

    it('EXISTS: next.config.js', () => {
        expect(fileExists(path.join(frontendRoot, 'next.config.js'))).toBe(true);
    });

    it('EXISTS: tsconfig.json', () => {
        expect(fileExists(path.join(frontendRoot, 'tsconfig.json'))).toBe(true);
    });

    it('EXISTS: package.json', () => {
        expect(fileExists(path.join(frontendRoot, 'package.json'))).toBe(true);
    });
});
