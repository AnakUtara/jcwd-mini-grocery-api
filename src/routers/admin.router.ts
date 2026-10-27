import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.middleware.ts";
import { adminProductRouter } from "./product.router.ts";
import { adminOrderRouter } from "./order.router.ts";

const adminRouter = Router();

adminRouter.use(authenticate, requireRole(["ADMIN"]));

adminRouter.use("/products", adminProductRouter);
adminRouter.use("/orders", adminOrderRouter);

export default adminRouter;
