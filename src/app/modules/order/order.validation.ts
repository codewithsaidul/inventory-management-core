import { z } from "zod";
import { OrderStatus } from "./order.interface";

export const orderValidationSchema = z.object({
  customerName: z.string().min(1, "Customer name is required").trim(),
  items: z
    .array(
      z.object({
        product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID"),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      }),
    )
    .min(1, "At least one product is required"),
  status: z
    .enum([...Object.values(OrderStatus)])
    .optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([...Object.values(OrderStatus)]),
});
