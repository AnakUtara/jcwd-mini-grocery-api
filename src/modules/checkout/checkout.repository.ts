// src/features/checkout/checkout.repository.ts
import prisma from "../../db/client.ts";
import { Prisma } from "../../generated/prisma/client.ts";
import type { OrderCreateInput } from "../../generated/prisma/models.ts";

class CheckoutRepository {
	// Accepts 'tx' so it can run inside an existing transaction
	static async lockProducts(
		productIds: string[],
		tx?: Prisma.TransactionClient,
	) {
		const client = tx ?? prisma;

		// Execute raw SQL for pessimistic lock
		return await client.$executeRaw`
      SELECT id FROM "products" 
      WHERE id IN (${Prisma.join(productIds)}) 
      FOR UPDATE
    `;
	}

	static async reserveStock(
		productId: string,
		quantity: number,
		tx?: Prisma.TransactionClient,
	) {
		const client = tx ?? prisma;

		return await client.product.update({
			where: { id: productId },
			data: { stock: { decrement: quantity } },
		});
	}

	static async replenishStock(
		productId: string,
		quantity: number,
		tx?: Prisma.TransactionClient,
	) {
		const client = tx ?? prisma;

		return await client.product.update({
			where: { id: productId },
			data: { stock: { increment: quantity } },
		});
	}

	static async createOrder(
		orderData: OrderCreateInput,
		tx?: Prisma.TransactionClient,
	) {
		const client = tx ?? prisma;

		return await client.order.create({
			data: orderData,
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	}
}

export default CheckoutRepository;
