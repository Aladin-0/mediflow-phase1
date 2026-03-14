import { z } from 'zod';

export const adjustmentSchema = z.object({
  adjustmentType: z.enum([
    'damage', 'theft', 'correction', 'return_from_patient'
  ]),
  qtyStrips: z.coerce.number().int(),
  qtyLoose: z.coerce.number().int(),
  reason: z.string().min(5, "Please provide a reason (min 5 chars)"),
});

export type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

