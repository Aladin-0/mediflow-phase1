import { z } from 'zod';

export const manualAttendanceSchema = z.object({
    staffId: z.string().min(1, 'Select a staff member'),
    date: z.string().min(1, 'Date required'),
    status: z.enum(['present', 'absent', 'late', 'half_day', 'holiday', 'weekly_off']),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional(),
    notes: z.string().optional(),
}).refine(
    data => {
        if (data.checkInTime && data.checkOutTime) {
            return data.checkOutTime > data.checkInTime;
        }
        return true;
    },
    {
        message: 'Check-out must be after check-in',
        path: ['checkOutTime'],
    }
);

export type ManualAttendanceFormValues = z.infer<typeof manualAttendanceSchema>;
