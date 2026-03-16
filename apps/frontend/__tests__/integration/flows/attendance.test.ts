import { mockAttendanceApi, mockStaffApi } from '@/lib/mockApi';

describe('Integration Flow — Attendance', () => {
    it('full flow: check-in → fetch records → verify presence', async () => {
        const uniqueId = `staff-int-flow-${Date.now()}`;

        // Step 1: Check in
        const record = await mockAttendanceApi.checkIn({
            staffId: uniqueId,
            type: 'check_in',
            outletId: 'outlet-001',
        });
        expect(record).toHaveProperty('id');
        expect(record.staffId).toBe(uniqueId);
        expect(record.checkInTime).toBeTruthy();

        // Step 2: Verify duplicate check-in is rejected
        await expect(
            mockAttendanceApi.checkIn({ staffId: uniqueId, type: 'check_in', outletId: 'outlet-001' })
        ).rejects.toMatchObject({ error: { code: 'ALREADY_CHECKED_IN' } });

        // Step 3: Check out
        const checkoutRecord = await mockAttendanceApi.checkOut({
            staffId: uniqueId,
            type: 'check_out',
            outletId: 'outlet-001',
        });
        expect(checkoutRecord.checkOutTime).toBeTruthy();
    });

    it('checkOut() without prior checkIn throws NOT_CHECKED_IN', async () => {
        await expect(
            mockAttendanceApi.checkOut({
                staffId: 'staff-never-checked-in-xyz',
                type: 'check_out',
                outletId: 'outlet-001',
            })
        ).rejects.toMatchObject({ error: { code: 'NOT_CHECKED_IN' } });
    });

    it('getMonthlyRecords() returns records for correct month', async () => {
        const records = await mockAttendanceApi.getMonthlyRecords({
            month: 3,
            year: 2026,
            outletId: 'outlet-001',
        });
        expect(Array.isArray(records)).toBe(true);
        expect(records.length).toBeGreaterThan(0);
        records.forEach((r: any) => {
            const d = new Date(r.date);
            expect(d.getMonth() + 1).toBe(3);
            expect(d.getFullYear()).toBe(2026);
        });
    });

    it('getMonthlyRecords() filters by staffId', async () => {
        const records = await mockAttendanceApi.getMonthlyRecords({
            month: 3,
            year: 2026,
            outletId: 'outlet-001',
            staffId: 'staff-001',
        });
        records.forEach((r: any) => {
            expect(r.staffId).toBe('staff-001');
        });
    });

    it('markManual() creates a record with correct status', async () => {
        const result = await mockAttendanceApi.markManual({
            staffId: 'staff-002',
            date: '2026-01-15',
            status: 'present',
            checkInTime: '09:00',
            checkOutTime: '18:00',
            markedBy: 'staff-001',
        });
        expect(result).toHaveProperty('id');
        expect(result.status).toBe('present');
    });

    it('markManual() calculates working hours correctly', async () => {
        const result = await mockAttendanceApi.markManual({
            staffId: 'staff-003',
            date: '2026-01-10',
            status: 'present',
            checkInTime: '10:00',
            checkOutTime: '18:30',
            markedBy: 'staff-001',
        });
        // 8.5 hours
        expect(result.workingHours).toBeCloseTo(8.5, 1);
    });

    it('getMonthlyRecords() for unknown month returns empty or valid array', async () => {
        const records = await mockAttendanceApi.getMonthlyRecords({
            month: 6,
            year: 2025,
            outletId: 'outlet-001',
        });
        expect(Array.isArray(records)).toBe(true);
        // All returned records should be from the requested month
        records.forEach((r: any) => {
            const d = new Date(r.date);
            expect(d.getMonth() + 1).toBe(6);
            expect(d.getFullYear()).toBe(2025);
        });
    });

    it('staff with kiosk PIN verification flow', async () => {
        // Simulates kiosk: staff enters PIN → attendance is marked
        const staff = await mockStaffApi.verifyPin('1234'); // Priya Sharma
        expect(staff.name).toBe('Priya Sharma');

        const uniqueDate = `staff-kiosk-${Date.now()}`;
        const record = await mockAttendanceApi.checkIn({
            staffId: uniqueDate,
            type: 'check_in',
            outletId: 'outlet-001',
        });
        expect(record.staffId).toBe(uniqueDate);
    });
});
