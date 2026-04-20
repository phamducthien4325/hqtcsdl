import { z } from "zod";

export const customerCreateSchema = z.object({
  customerNumber: z.number().int(),
  customerName: z.string().min(1),
  contactLastName: z.string().min(1),
  contactFirstName: z.string().min(1),
  phone: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().nullable().optional(),
  city: z.string().min(1),
  state: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  country: z.string().min(1),
  salesRepEmployeeNumber: z.number().int().nullable().optional(),
  creditLimit: z.coerce.number().nullable().optional()
});

export const customerUpdateSchema = customerCreateSchema.partial().omit({ customerNumber: true });
