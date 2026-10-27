import type { NextFunction, Request, Response } from "express";
import { CheckoutService } from "./checkout.service.ts";
import { snapClient } from "../../lib/midtrans.ts";
import OrderRepository from "../order/order.repository.ts";
import { OrderStatus } from "../../generated/prisma/enums.ts";
import {
	APP_PUBLIC_URL,
	PAYGATE_SERVER_KEY,
} from "../../configs/env.config.ts";
import crypto from "crypto";

class CheckoutController {
	static checkoutWithPaymentGateway = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		const customerId = req.user?.id as string;

		const order = await CheckoutService.processCheckout(customerId);

		const snapParams = {
			override_notification_urls: [`${APP_PUBLIC_URL}/api/webhooks/midtrans`],
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
		const {
			order_id,
			status_code,
			gross_amount,
			signature_key,
			transaction_status,
			fraud_status,
		} = req.body;

		console.log(req.body);

		// 1. Verify Midtrans Signature Locally
		const payloadToHash = `${order_id}${status_code}${gross_amount}${PAYGATE_SERVER_KEY}`;
		const calculatedSignature = crypto
			.createHash("sha512")
			.update(payloadToHash)
			.digest("hex");

		if (calculatedSignature !== signature_key) {
			return res.status(403).json({ message: "Invalid signature key" });
		}

		switch (transaction_status) {
			case "settlement":
			case "capture":
				await OrderRepository.update(order_id, {
					status: OrderStatus.PAID,
				});
				break;
			case "expire":
			case "cancel":
			case "deny":
				await CheckoutService.handleFailedCheckout(
					order_id,
					transaction_status,
				);
				break;
		}

		res.send({ message: "ok" });
	};
}

export default CheckoutController;
