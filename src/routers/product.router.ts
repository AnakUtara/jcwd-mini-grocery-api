import { Router } from "express";
import ProductController from "../modules/product/product.controller.ts";
import requestValidator from "../middlewares/request-validator.middleware.ts";
import {
	productCreateSchema,
	productUpdateSchema,
} from "../validators/product.validator.ts";

const productRouter = Router();

productRouter.get("/", ProductController.getAll);
productRouter.get("/:id", ProductController.getById);

export const adminProductRouter = Router();

adminProductRouter.get("/", ProductController.getAllByOwnerId);

adminProductRouter.post(
	"/",
	requestValidator(productCreateSchema),
	ProductController.create,
);
adminProductRouter.put(
	"/:id",
	requestValidator(productUpdateSchema),
	ProductController.update,
);
adminProductRouter.delete("/:id", ProductController.delete);

export default productRouter;
