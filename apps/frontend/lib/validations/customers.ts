import * as z from 'zod';

export const customerSchema = z.object({
    name: z.string().min(2, "Name required"),
    phone: z.string()
        .length(10, "Must be 10 digits")
        .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    address: z.string().optional(),
    dob: z.string().optional(),
    bloodGroup: z.string().optional(),
    fixedDiscount: z.coerce.number().min(0).max(30).default(0),
    creditLimit: z.coerce.number().min(0).default(1000),
    gstin: z.string().optional()
        .refine(v => !v || /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/.test(v), "Invalid GSTIN"),
    isChronic: z.boolean().default(false),
    chronicConditions: z.array(z.string()).default([]),
    preferredDoctorId: z.string().optional(),
    allergies: z.array(z.string()).default([]),
    notes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
