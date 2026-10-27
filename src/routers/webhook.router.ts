import { Router } from "express";
import CheckoutController from "../modules/checkout/checkout.controller.ts";

const webhookRouter = Router();

webhookRouter.post(
	"/midtrans",
	CheckoutController.midtransPaymentNotificationHandler,
);

export default webhookRouter;
