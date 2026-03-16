import { useSettingsStore } from '@/store/settingsStore';

beforeEach(() => {
    // Reset to defaults by calling resetToDefaults
    useSettingsStore.getState().resetToDefaults?.();
});

describe('SettingsStore — defaults', () => {
    it('printerType defaults to "thermal"', () => {
        expect(useSettingsStore.getState().printerType).toBe('thermal');
    });

    it('thermalWidth defaults to "80mm"', () => {
        expect(useSettingsStore.getState().thermalWidth).toBe('80mm');
    });

    it('gstType defaults to "intrastate"', () => {
        expect(useSettingsStore.getState().gstType).toBe('intrastate');
    });

    it('outletStateCode defaults to "27" (Maharashtra)', () => {
        expect(useSettingsStore.getState().outletStateCode).toBe('27');
    });

    it('attendanceGraceMinutes defaults to 10', () => {
        expect(useSettingsStore.getState().attendanceGraceMinutes).toBe(10);
    });

    it('kioskAutoResetSeconds defaults to 5', () => {
        expect(useSettingsStore.getState().kioskAutoResetSeconds).toBe(5);
    });

    it('requirePinForEveryBill defaults to true', () => {
        expect(useSettingsStore.getState().requirePinForEveryBill).toBe(true);
    });

    it('pinSessionTimeoutMins defaults to 30', () => {
        expect(useSettingsStore.getState().pinSessionTimeoutMins).toBe(30);
    });

    it('enableAttendance defaults to true', () => {
        expect(useSettingsStore.getState().enableAttendance).toBe(true);
    });

    it('enableCreditSales defaults to true', () => {
        expect(useSettingsStore.getState().enableCreditSales).toBe(true);
    });

    it('creditWarningThresholdPct defaults to 80', () => {
        expect(useSettingsStore.getState().creditWarningThresholdPct).toBe(80);
    });

    it('theme defaults to "light"', () => {
        expect(useSettingsStore.getState().theme).toBe('light');
    });
});

describe('SettingsStore — update actions', () => {
    it('updateGSTSettings changes gstType', () => {
        useSettingsStore.getState().updateGSTSettings({ gstType: 'interstate' });
        expect(useSettingsStore.getState().gstType).toBe('interstate');
    });

    it('updatePrinterSettings changes printerType', () => {
        useSettingsStore.getState().updatePrinterSettings({ printerType: 'a4' });
        expect(useSettingsStore.getState().printerType).toBe('a4');
    });

    it('updateBillingSettings changes requirePinForEveryBill', () => {
        useSettingsStore.getState().updateBillingSettings({ requirePinForEveryBill: false });
        expect(useSettingsStore.getState().requirePinForEveryBill).toBe(false);
    });

    it('updateAttendanceSettings changes enableAttendance', () => {
        useSettingsStore.getState().updateAttendanceSettings({ enableAttendance: false });
        expect(useSettingsStore.getState().enableAttendance).toBe(false);
    });

    it('updateNotificationSettings changes lowStockThreshold', () => {
        useSettingsStore.getState().updateNotificationSettings({ lowStockThreshold: 25 });
        expect(useSettingsStore.getState().lowStockThreshold).toBe(25);
    });

    it('updateOutletSettings changes outletName', () => {
        useSettingsStore.getState().updateOutletSettings({ outletName: 'Test Pharmacy' });
        expect(useSettingsStore.getState().outletName).toBe('Test Pharmacy');
    });
});

describe('SettingsStore — sidebar', () => {
    it('toggleSidebar flips isSidebarCollapsed', () => {
        const before = useSettingsStore.getState().isSidebarCollapsed;
        useSettingsStore.getState().toggleSidebar();
        expect(useSettingsStore.getState().isSidebarCollapsed).toBe(!before);
    });
});

describe('SettingsStore — resetToDefaults', () => {
    it('resetToDefaults restores printerType to thermal', () => {
        useSettingsStore.getState().updatePrinterSettings({ printerType: 'a4' });
        useSettingsStore.getState().resetToDefaults?.();
        expect(useSettingsStore.getState().printerType).toBe('thermal');
    });

    it('resetToDefaults restores enableAttendance to true', () => {
        useSettingsStore.getState().updateAttendanceSettings({ enableAttendance: false });
        useSettingsStore.getState().resetToDefaults?.();
        expect(useSettingsStore.getState().enableAttendance).toBe(true);
    });
});
