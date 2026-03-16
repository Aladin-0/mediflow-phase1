import {
    outletSettingsSchema,
    gstSettingsSchema,
    printerSettingsSchema,
    billingSettingsSchema,
    attendanceSettingsSchema,
    notificationSettingsSchema,
} from '@/lib/validations/settings';

// ─── Outlet Settings ──────────────────────────────────────────────────────────

describe('outletSettingsSchema', () => {
    const valid = {
        outletName: 'Test Pharmacy',
        outletAddress: '123 MG Road',
        outletCity: 'Pune',
        outletState: 'Maharashtra',
        outletPincode: '411001',
        outletPhone: '9876543210',
        outletEmail: '',
        outletGstin: '',
        outletDrugLicenseNo: 'DL-MH-001',
        invoiceFooter: 'Thank you',
        invoiceHeader: '',
    };

    it('passes for valid outlet data', () => {
        expect(() => outletSettingsSchema.parse(valid)).not.toThrow();
    });

    it('fails for pincode < 6 digits', () => {
        const result = outletSettingsSchema.safeParse({ ...valid, outletPincode: '411' });
        expect(result.success).toBe(false);
    });

    it('fails for non-numeric pincode', () => {
        const result = outletSettingsSchema.safeParse({ ...valid, outletPincode: 'ABCDEF' });
        expect(result.success).toBe(false);
    });

    it('fails for phone not starting with 6-9', () => {
        const result = outletSettingsSchema.safeParse({ ...valid, outletPhone: '1234567890' });
        expect(result.success).toBe(false);
    });

    it('passes for empty email (optional)', () => {
        const result = outletSettingsSchema.safeParse({ ...valid, outletEmail: '' });
        expect(result.success).toBe(true);
    });

    it('fails for invalid email format', () => {
        const result = outletSettingsSchema.safeParse({ ...valid, outletEmail: 'not-an-email' });
        expect(result.success).toBe(false);
    });

    it('passes for valid GSTIN', () => {
        const result = outletSettingsSchema.safeParse({ ...valid, outletGstin: '27AABCA1234A1Z5' });
        expect(result.success).toBe(true);
    });

    it('fails for invalid GSTIN', () => {
        const result = outletSettingsSchema.safeParse({ ...valid, outletGstin: 'INVALID' });
        expect(result.success).toBe(false);
    });

    it('passes for empty GSTIN (optional)', () => {
        const result = outletSettingsSchema.safeParse({ ...valid, outletGstin: '' });
        expect(result.success).toBe(true);
    });

    it('fails for invoiceFooter > 120 chars', () => {
        const result = outletSettingsSchema.safeParse({ ...valid, invoiceFooter: 'x'.repeat(121) });
        expect(result.success).toBe(false);
    });

    it('fails for invoiceHeader > 80 chars', () => {
        const result = outletSettingsSchema.safeParse({ ...valid, invoiceHeader: 'x'.repeat(81) });
        expect(result.success).toBe(false);
    });
});

// ─── GST Settings ─────────────────────────────────────────────────────────────

describe('gstSettingsSchema', () => {
    const valid = {
        gstType: 'intrastate' as const,
        enableGST: true,
        defaultGSTRate: 12,
        roundOffInvoice: true,
        showGSTBreakup: true,
        outletStateCode: '27',
    };

    it('passes for valid GST settings', () => {
        expect(() => gstSettingsSchema.parse(valid)).not.toThrow();
    });

    it('fails for invalid gstType', () => {
        const result = gstSettingsSchema.safeParse({ ...valid, gstType: 'composite' });
        expect(result.success).toBe(false);
    });

    it('fails for gstRate > 28', () => {
        const result = gstSettingsSchema.safeParse({ ...valid, defaultGSTRate: 30 });
        expect(result.success).toBe(false);
    });

    it('fails for outletStateCode > 2 chars', () => {
        const result = gstSettingsSchema.safeParse({ ...valid, outletStateCode: '027' });
        expect(result.success).toBe(false);
    });
});

// ─── Printer Settings ─────────────────────────────────────────────────────────

describe('printerSettingsSchema', () => {
    const valid = {
        printerType: 'thermal' as const,
        thermalWidth: '80mm' as const,
        autoPrintAfterBill: false,
        printCopies: 1,
        showMRPOnInvoice: true,
        showBatchOnInvoice: true,
        showDoctorOnInvoice: true,
    };

    it('passes for thermal printer config', () => {
        expect(() => printerSettingsSchema.parse(valid)).not.toThrow();
    });

    it('passes for a4 printer config', () => {
        expect(() => printerSettingsSchema.parse({ ...valid, printerType: 'a4' })).not.toThrow();
    });

    it('fails for unknown printerType', () => {
        const result = printerSettingsSchema.safeParse({ ...valid, printerType: 'dot_matrix' });
        expect(result.success).toBe(false);
    });

    it('fails for printCopies > 3', () => {
        const result = printerSettingsSchema.safeParse({ ...valid, printCopies: 4 });
        expect(result.success).toBe(false);
    });

    it('fails for printCopies < 1', () => {
        const result = printerSettingsSchema.safeParse({ ...valid, printCopies: 0 });
        expect(result.success).toBe(false);
    });

    it('NOTE: old printerType "thermal_80mm" is no longer valid (breaking change)', () => {
        // Stage 15 changed printerType from 'thermal_80mm'/'thermal_57mm' to 'thermal'
        const result = printerSettingsSchema.safeParse({ ...valid, printerType: 'thermal_80mm' });
        expect(result.success).toBe(false);
    });
});

// ─── Billing Settings ─────────────────────────────────────────────────────────

describe('billingSettingsSchema', () => {
    const valid = {
        defaultDiscountPct: 0,
        allowNegativeStock: false,
        requirePinForEveryBill: true,
        pinSessionTimeoutMins: 30,
        enableLooseTablets: true,
        enableCreditSales: true,
        creditWarningThresholdPct: 80,
        enableWhatsAppReceipt: false,
    };

    it('passes for valid billing settings', () => {
        expect(() => billingSettingsSchema.parse(valid)).not.toThrow();
    });

    it('fails for defaultDiscountPct > 30', () => {
        const result = billingSettingsSchema.safeParse({ ...valid, defaultDiscountPct: 31 });
        expect(result.success).toBe(false);
    });

    it('fails for pinSessionTimeoutMins < 5', () => {
        const result = billingSettingsSchema.safeParse({ ...valid, pinSessionTimeoutMins: 4 });
        expect(result.success).toBe(false);
    });

    it('fails for creditWarningThresholdPct < 50', () => {
        const result = billingSettingsSchema.safeParse({ ...valid, creditWarningThresholdPct: 40 });
        expect(result.success).toBe(false);
    });
});

// ─── Attendance Settings ──────────────────────────────────────────────────────

describe('attendanceSettingsSchema', () => {
    const valid = {
        attendanceGraceMinutes: 10,
        kioskPhotoCapture: true,
        kioskAutoResetSeconds: 5,
        enableAttendance: true,
        workingHoursPerDay: 8,
    };

    it('passes for valid attendance settings', () => {
        expect(() => attendanceSettingsSchema.parse(valid)).not.toThrow();
    });

    it('fails for graceMinutes > 60', () => {
        const result = attendanceSettingsSchema.safeParse({ ...valid, attendanceGraceMinutes: 61 });
        expect(result.success).toBe(false);
    });

    it('fails for kioskAutoResetSeconds < 3', () => {
        const result = attendanceSettingsSchema.safeParse({ ...valid, kioskAutoResetSeconds: 2 });
        expect(result.success).toBe(false);
    });

    it('fails for workingHoursPerDay > 12', () => {
        const result = attendanceSettingsSchema.safeParse({ ...valid, workingHoursPerDay: 13 });
        expect(result.success).toBe(false);
    });
});

// ─── Notification Settings ────────────────────────────────────────────────────

describe('notificationSettingsSchema', () => {
    const valid = {
        notifyLowStock: true,
        lowStockThreshold: 10,
        notifyExpiryDays: 90,
        notifyOverdueCredit: true,
        notifyRefillDue: true,
        whatsappNotifications: false,
    };

    it('passes for valid notification settings', () => {
        expect(() => notificationSettingsSchema.parse(valid)).not.toThrow();
    });

    it('fails for lowStockThreshold < 1', () => {
        const result = notificationSettingsSchema.safeParse({ ...valid, lowStockThreshold: 0 });
        expect(result.success).toBe(false);
    });

    it('fails for notifyExpiryDays < 7', () => {
        const result = notificationSettingsSchema.safeParse({ ...valid, notifyExpiryDays: 6 });
        expect(result.success).toBe(false);
    });

    it('fails for notifyExpiryDays > 365', () => {
        const result = notificationSettingsSchema.safeParse({ ...valid, notifyExpiryDays: 366 });
        expect(result.success).toBe(false);
    });
});
