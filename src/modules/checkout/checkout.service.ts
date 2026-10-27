// src/features/checkout/checkout.service.ts
import prisma from "../../db/client.ts";
import CheckoutRepository from "./checkout.repository.js";
import CartRepository from "../cart/cart.repository.js";
import AppError from "../../errors/app.error.js";
import CartService from "../cart/cart.service.ts";
import { OrderStatus } from "../../generated/prisma/enums.ts";
import OrderRepository from "../order/order.repository.ts";
import type { Prisma } from "../../generated/prisma/client.ts";

export class CheckoutService {
	static async processCheckout(customerId: string) {
		// 1. Fetch Cart (Outside transaction)
		const cart = await CartService.getCart(customerId);

		if (!cart || !cart.items.length) {
			throw new AppError("Cart is empty", 400);
		}

		const productIds = cart.items.map((i) => i.productId);

		const newOrder = await prisma.$transaction(async (tx) => {
			await CheckoutRepository.lockProducts(productIds, tx);

			for (const item of cart.items) {
				const product = await tx.product.findUnique({
					where: { id: item.productId },
				});

				if (!product || product.stock < item.quantity) {
					throw new AppError(
						`Product ${item.product.name} is out of stock or insufficient.`,
						400,
					);
				}
			}

			for (const item of cart.items) {
				await CheckoutRepository.reserveStock(
					item.productId,
					item.quantity,
					tx,
				);
			}

			const order = await CheckoutRepository.createOrder(
				{
					customer: {
						connect: {
							id: customerId,
						},
					},
					totalAmount: cart.totalAmount,
					status: OrderStatus.PENDING,
					items: {
						createMany: {
							data: cart.items.map((item) => ({
								productId: item.productId,
								productName: item.product.name,
								price: item.product.discountPrice ?? item.product.price,
								quantity: item.quantity,
							})),
						},
					},
				},
				tx,
			);

			await CartRepository.clearCartItems(cart.id as string, tx);

			return order;
		});

		return newOrder;
	}
	static async handleFailedCheckout(
		orderId: string,
		status: "cancel" | "deny" | "expire",
	) {
		const targetStatus: OrderStatus =
			status === "expire" ? OrderStatus.EXPIRED : OrderStatus.CANCELLED;

		const failedOrder = await prisma.$transaction(
			async (tx: Prisma.TransactionClient) => {
				const existingOrder = await tx.order.findUnique({
					where: { id: orderId },
					include: { items: true },
				});

				if (
					!existingOrder ||
					existingOrder.status === OrderStatus.CANCELLED ||
					existingOrder.status === OrderStatus.EXPIRED ||
					existingOrder.status === OrderStatus.PAID
				) {
					return existingOrder;
				}

				const order = await OrderRepository.update(
					orderId,
					{ status: targetStatus },
					tx,
				);

				for (const item of order.items) {
					await CheckoutRepository.replenishStock(
						item.productId,
						item.quantity,
						tx,
					);
				}

				return order;
			},
		);

		return failedOrder;
	}
}
