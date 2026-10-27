import prisma from "../../db/client.ts";
import type { Prisma } from "../../generated/prisma/client.ts";

class CartRepository {
	static async getOrCreate(customerId: string) {
		return await prisma.cart.upsert({
			where: { customerId },
			create: { customerId },
			update: {},
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	}

	static async upsertCartItems(cartId: string, productId: string, qty: number) {
		return await prisma.cartItem.upsert({
			where: {
				cartId_productId: {
					cartId,
					productId,
				},
			},
			create: {
				cartId,
				productId,
				quantity: qty,
			},
			update: {
				quantity: { increment: qty },
			},
			include: {
				product: true,
			},
		});
	}

	static async updateCartItemQty(cartItemId: string, qty: number) {
		return await prisma.cartItem.update({
			where: {
				id: cartItemId,
			},
			data: { quantity: qty },
			include: { product: true },
		});
	}

	static async removeCartItem(
		cartItemId: string,
		tx?: Prisma.TransactionClient,
	) {
		const client = tx ?? prisma;
		return await client.cartItem.delete({
			where: { id: cartItemId },
		});
	}

	static async clearCartItems(cartId: string, tx?: Prisma.TransactionClient) {
		const client = tx ?? prisma;
		return await client.cartItem.deleteMany({
			where: { cartId },
		});
	}
}

export default CartRepository;
