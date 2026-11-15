import { z } from "zod";

export const planSchema = z.object({
  title: z.string().trim().min(1).max(60),
  months: z.number().int().min(1).max(36),
  price: z.number().int().min(100).max(10_000_000),
  active: z.boolean().default(true),
});
