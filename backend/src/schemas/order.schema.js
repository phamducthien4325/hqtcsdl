import { z } from "zod";

export const orderDetailInputSchema = z.object({
  productCode: z.string().min(1),
  quantityOrdered: z.number().int().positive(),
  priceEach: z.coerce.number().positive(),
  orderLineNumber: z.number().int().positive()
});

export const orderCreateSchema = z.object({
  orderNumber: z.number().int(),
  orderDate: z.string(),
  requiredDate: z.string(),
  shippedDate: z.string().nullable().optional(),
  status: z.string().min(1),
  comments: z.string().nullable().optional(),
  customerNumber: z.number().int(),
  orderDetails: z.array(orderDetailInputSchema).min(1)
});

export const orderUpdateSchema = orderCreateSchema.partial().omit({ orderNumber: true });
