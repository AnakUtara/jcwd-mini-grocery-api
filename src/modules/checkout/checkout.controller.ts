import type { NextFunction, Request, Response } from "express";
import { CheckoutService } from "./checkout.service.ts";
import { snapClient } from "../../lib/midtrans.ts";
import OrderRepository from "../order/order.repository.ts";
import { OrderStatus } from "../../generated/prisma/enums.ts";

class CheckoutController {
	static checkoutWithPaymentGateway = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		const customerId = req.user?.id as string;

		const order = await CheckoutService.processCheckout(customerId);

		const snapParams = {
			transaction_details: {
				order_id: order.id,
				gross_amount: order.totalAmount,
			},
			item_details: order.items.map((item) => ({
				id: item.id,
				product_id: item.productId,
				name: item.productName,
				price: item.price,
				quantity: item.quantity,
			})),
			customer_details: {
				id: customerId,
				email: req.user?.email,
				name: req.user?.name,
			},
		};

		const transaction = await snapClient.createTransaction(snapParams);

		if (transaction) {
			await OrderRepository.update(order.id, {
				snapToken: transaction.token,
				snapRedirectUrl: transaction.redirect_url,
			});
		}

		res.send({
			message: "Order created successfully!",
			data: {
				order,
				token: transaction.token,
				redirectUrl: transaction.redirect_url,
			},
		});
	};
	static midtransPaymentNotificationHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		const notification = await snapClient.transaction.notification(req.body);

		console.log(notification);

		switch (notification.transaction_status) {
			case "settlement":
			case "capture":
				await OrderRepository.update(notification.order_id, {
					status: OrderStatus.PAID,
				});
				break;
			case "expire":
			case "cancel":
			case "deny":
				await CheckoutService.handleFailedCheckout(
					notification.order_id,
					notification.transaction_status,
				);
				break;
		}

		res.send({ message: "ok" });
	};
}

export default CheckoutController;
