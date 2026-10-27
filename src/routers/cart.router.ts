import { Router } from "express";
import CartController from "../modules/cart/cart.controller.ts";
import { authenticate, requireRole } from "../middlewares/auth.middleware.ts";
import requestValidator from "../middlewares/request-validator.middleware.ts";
import {
	cartItemUpsertSchema,
	updateItemQtySchema,
} from "../validators/cart.validator.ts";

const cartRouter = Router();

cartRouter.use(authenticate, requireRole(["CUSTOMER"]));

cartRouter.get("/", CartController.getCart);
cartRouter.post(
	"/items",
	requestValidator(cartItemUpsertSchema, "body"),
	CartController.addItem,
);
cartRouter.patch(
	"/items/:id",
	requestValidator(updateItemQtySchema, "body"),
	CartController.updateItemQuantity,
);
cartRouter.delete("/items/:id", CartController.removeItem);

export default cartRouter;
