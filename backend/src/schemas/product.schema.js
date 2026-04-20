import { z } from "zod";

export const productCreateSchema = z.object({
  productCode: z.string().min(1),
  productName: z.string().min(1),
  productLine: z.string().min(1),
  productScale: z.string().min(1),
  productVendor: z.string().min(1),
  productDescription: z.string().min(1),
  quantityInStock: z.number().int(),
  buyPrice: z.coerce.number().positive(),
  MSRP: z.coerce.number().positive()
});

export const productUpdateSchema = productCreateSchema.partial().omit({ productCode: true });
