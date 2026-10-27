import { Router } from "express";
import CheckoutController from "../modules/checkout/checkout.controller.ts";
import { authenticate, requireRole } from "../middlewares/auth.middleware.ts";

const checkoutRouter = Router();

checkoutRouter.use(authenticate, requireRole(["CUSTOMER"]));

checkoutRouter.post("/", CheckoutController.checkoutWithPaymentGateway);

export default checkoutRouter;
