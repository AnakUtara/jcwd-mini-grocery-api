import type { NextFunction, Request, Response } from "express";
import CartRepository from "./cart.repository.ts";
import CartService from "./cart.service.ts";

class CartController {
	static getCart = async (req: Request, res: Response, next: NextFunction) => {
		const customerId = req.user?.id as string;

		const { id, items, totalAmount } = await CartService.getCart(customerId);

		return res.status(200).json({
			data: {
				id,
				items,
				totalAmount,
			},
		});
	};
	static addItem = async (req: Request, res: Response, next: NextFunction) => {
		const customerId = req.user?.id as string;
		const { productId, quantity } = req.body;

		const cart = await CartRepository.getOrCreate(customerId);

		const cartItem = await CartRepository.upsertCartItems(
			cart.id,
			productId,
			quantity,
		);

		return res.status(200).json({
			message: "Item added to cart",
			data: cartItem,
		});
	};
	static updateItemQuantity = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		const cartItemId = req.params.id as string;
		const { quantity } = req.body;

		if (quantity <= 0) {
			await CartRepository.removeCartItem(cartItemId);

			return res.status(200).json({ message: "Item removed from cart" });
		}

		const updatedItem = await CartRepository.updateCartItemQty(
			cartItemId,
			quantity,
		);

		return res.status(200).json({
			message: "Cart item updated",
			data: updatedItem,
		});
	};
	static removeItem = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		const cartItemId = req.params?.id as string;

		await CartRepository.removeCartItem(cartItemId);

		return res.status(200).json({ message: "Item removed successfully" });
	};
}

export default CartController;
