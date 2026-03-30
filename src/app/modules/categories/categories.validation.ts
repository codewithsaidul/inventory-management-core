import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({
      error: "Category name is required",
    })
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  description: z.string().max(200, "Description is too long").optional(),

  isActive: z.boolean().default(true).optional(),
});


export const updateCategorySchema = createCategorySchema.partial();
