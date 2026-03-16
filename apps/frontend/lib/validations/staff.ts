import { z } from 'zod'

export const staffPinSchema = z.object({
  pin: z.string().length(4)
    .regex(/^\d{4}$/, 'PIN must be 4 digits'),
})

export const staffSchema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().length(10)
    .regex(/^[6-9]\d{9}$/, 'Invalid phone'),
  role: z.enum([
    'super_admin','admin','manager',
    'billing_staff','view_only'
  ]),
  staffPin: z.string().length(4)
    .regex(/^\d{4}$/, 'PIN must be 4 digits'),
  maxDiscount: z.number().min(0).max(30),
  canEditRate: z.boolean().default(false),
  canViewPurchaseRates: z.boolean().default(false),
  canCreatePurchases: z.boolean().default(false),
  canAccessReports: z.boolean().default(false),
})

export type StaffFormData =
  z.infer<typeof staffSchema>
