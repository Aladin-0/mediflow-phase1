import { manualAttendanceSchema } from '@/lib/validations/attendance';

const validPayload = {
    staffId: 'staff-001',
    date: '2026-03-14',
    status: 'present' as const,
    checkInTime: '09:00',
    checkOutTime: '18:00',
};

describe('manualAttendanceSchema', () => {
    it('passes for valid present record', () => {
        expect(() => manualAttendanceSchema.parse(validPayload)).not.toThrow();
    });

    it('passes without checkInTime / checkOutTime', () => {
        const payload = { staffId: 'staff-001', date: '2026-03-14', status: 'absent' as const };
        expect(() => manualAttendanceSchema.parse(payload)).not.toThrow();
    });

    it('fails when staffId is empty', () => {
        const result = manualAttendanceSchema.safeParse({ ...validPayload, staffId: '' });
        expect(result.success).toBe(false);
    });

    it('fails when date is empty', () => {
        const result = manualAttendanceSchema.safeParse({ ...validPayload, date: '' });
        expect(result.success).toBe(false);
    });

    it('fails for invalid status', () => {
        const result = manualAttendanceSchema.safeParse({ ...validPayload, status: 'on_leave' });
        expect(result.success).toBe(false);
    });

    it('passes for all valid statuses', () => {
        const statuses = ['present', 'absent', 'late', 'half_day', 'holiday', 'weekly_off'] as const;
        statuses.forEach(status => {
            const result = manualAttendanceSchema.safeParse({ ...validPayload, status });
            expect(result.success).toBe(true);
        });
    });

    it('fails when checkOut is before checkIn', () => {
        const result = manualAttendanceSchema.safeParse({
            ...validPayload,
            checkInTime: '18:00',
            checkOutTime: '09:00',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            const msg = result.error.issues[0].message;
            expect(msg).toContain('Check-out must be after check-in');
        }
    });

    it('fails when checkOut equals checkIn (schema uses strict > comparison)', () => {
        // The schema uses checkOutTime > checkInTime which fails for equal strings
        const result = manualAttendanceSchema.safeParse({
            ...validPayload,
            checkInTime: '09:00',
            checkOutTime: '09:00',
        });
        // Equal times correctly rejected — no bug here
        expect(result.success).toBe(false);
    });

    it('passes when only checkInTime is provided (no checkOut)', () => {
        const result = manualAttendanceSchema.safeParse({
            staffId: 'staff-001',
            date: '2026-03-14',
            status: 'present' as const,
            checkInTime: '09:00',
        });
        expect(result.success).toBe(true);
    });
});
