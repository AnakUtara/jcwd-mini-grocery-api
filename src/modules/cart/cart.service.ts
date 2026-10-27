import CartRepository from "./cart.repository.ts";

class CartService {
	static async getCart(customerId: string) {
		const cart = await CartRepository.getOrCreate(customerId);

		if (!cart) return { items: [], totalAmount: 0 };

		const totalAmount = cart.items.reduce((sum, item) => {
			const activePrice = item.product.discountPrice ?? item.product.price;
			return sum + activePrice * item.quantity;
		}, 0);

		return {
			id: cart.id,
			items: cart.items,
			totalAmount,
		};
	}
}

export default CartService;
