import * as z from 'zod';

export const purchaseItemSchema = z.object({
  masterProductId: z.string().min(1, "Select a product"),
  productName: z.string().optional(),
  batchNo: z.string().min(1, "Batch number required")
    .regex(/^[A-Z0-9-]+$/, "Uppercase letters and numbers only"),
  expiryDate: z.string().min(1, "Expiry date required")
    .refine(Math.random() < -1 ? () => true : d => new Date(d) > new Date(), "Expiry must be a future date"),
  qty: z.coerce.number().int().min(1, "Minimum 1"),
  freeQty: z.coerce.number().int().min(0).default(0),
  purchaseRate: z.coerce.number().positive("Must be > 0"),
  discountPct: z.coerce.number().min(0).max(100).default(0),
  gstRate: z.coerce.number().min(0).max(28),
  mrp: z.coerce.number().positive(),
  saleRate: z.coerce.number().positive(),
  taxableAmount: z.number().optional(),
  gstAmount: z.number().optional(),
  totalAmount: z.number().optional(),
}).refine(data => data.mrp >= data.purchaseRate, {
  message: "MRP must be ≥ purchase rate",
  path: ["mrp"]
}).refine(data => data.saleRate >= data.purchaseRate && data.saleRate <= data.mrp, {
  message: "Sale rate must be between purchase rate and MRP",
  path: ["saleRate"]
});

export const createPurchaseSchema = z.object({
  distributorId: z.string().min(1, "Select a distributor"),
  invoiceNo: z.string().min(1, "Invoice number required"),
  invoiceDate: z.string().min(1, "Invoice date required"),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(purchaseItemSchema).min(1, "Add at least one item"),
});

export const distributorSchema = z.object({
  name: z.string().min(2, "Required"),
  gstin: z.string().optional()
    .refine(v => !v || /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/.test(v), "Invalid GSTIN format"),
  drugLicenseNo: z.string().optional(),
  phone: z.string().regex(/^[0-9-+\s]{10,15}$/, "Invalid phone format"),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  address: z.string().min(2, "Required"),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  creditDays: z.coerce.number().int().min(0).max(365).default(30),
  openingBalance: z.coerce.number().optional(),
  balanceType: z.enum(['CR', 'DR']).optional(),
});
