import { Router } from "express";
import OrderController from "../modules/order/order.controller.ts";
import { authenticate, requireRole } from "../middlewares/auth.middleware.ts";

export const adminOrderRouter = Router();

adminOrderRouter.get("/", OrderController.getAll);

const orderRouter = Router();

orderRouter.use(authenticate);

orderRouter.get(
	"/",
	requireRole(["CUSTOMER"]),
	OrderController.getAllByCustomerID,
);
orderRouter.get("/:id", OrderController.getById);

export default orderRouter;
