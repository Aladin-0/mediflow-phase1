import * as z from 'zod';

export const scheduleHSchema = z.object({
  patientName: z.string().min(2, "Required"),
  patientAge: z.coerce.number().min(1).max(120),
  patientAddress: z.string().min(5, "Required"),
  doctorName: z.string().min(2, "Required"),
  doctorRegNo: z.string().min(3, "Required"),
  prescriptionNo: z.string().optional(),
});

export type ScheduleHData = z.infer<typeof scheduleHSchema>;
