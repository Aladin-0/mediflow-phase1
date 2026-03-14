import * as z from 'zod';

export const creditPaymentSchema = z.object({
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    mode: z.enum(['cash', 'upi', 'card', 'cheque']),
    reference: z.string().optional(),
    notes: z.string().optional(),
    paymentDate: z.string().min(1, "Date required"),
});

export type CreditPaymentFormData = z.infer<typeof creditPaymentSchema>;
