import z from "zod";

export const productCreateSchema = z.object({
	name: z.string().min(2).max(500),
	description: z.string().max(5000).nullable(),
	images: z.record(z.string(), z.url()).nullable(),
	price: z.coerce.number().int().min(1),
	discountPrice: z.coerce.number().int().nullable(),
	stock: z.coerce.number().int().min(0),
});

productCreateSchema.refine(
	(data) => {
		if (data.discountPrice) {
			return data.discountPrice < data.price;
		}
		return true;
	},
	{
		message: "Discount price must be lower than the regular price",
		path: ["discountPrice"],
	},
);

export const productUpdateSchema = productCreateSchema.partial();
