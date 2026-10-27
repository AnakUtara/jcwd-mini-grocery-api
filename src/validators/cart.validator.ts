import z from "zod";

export const cartItemUpsertSchema = z.object({
	quantity: z.coerce.number().min(0),
	productId: z.string(),
});

export const updateItemQtySchema = z.object({
	quantity: z.coerce.number().min(0),
});
