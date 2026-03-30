import { z } from "zod";
import { ProductStatus } from "./product.interface";

export const productValidationSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID"),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  minThreshold: z
    .number()
    .int()
    .min(1, "Threshold must be at least 1")
    .default(5),
  status: z.enum([...Object.values(ProductStatus)]).optional(),
});


export const updateProductValidation = productValidationSchema.partial()
