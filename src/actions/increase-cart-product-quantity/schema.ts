import { z } from "zod";

export const increaseCartProductQuantitySchema = z.object({
  cartItemId: z.string().uuid(),
});

export type IncreaseCartProductQuantitySchema = z.infer<
  typeof increaseCartProductQuantitySchema
>;
