import express, {
	json,
	Router,
	urlencoded,
	type Application,
	type Request,
	type Response,
} from "express";
import cors from "cors";
import appErrorHandler, {
	errorNormalizer,
} from "./errors/app-error.handler.ts";
import { APP_NAME, CLIENT_URL } from "./configs/env.config.ts";
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { auth } from "./lib/auth.ts";
import adminRouter from "./routers/admin.router.ts";
import productRouter from "./routers/product.router.ts";
import cartRouter from "./routers/cart.router.ts";
import checkoutRouter from "./routers/checkout.router.ts";
import orderRouter from "./routers/order.router.ts";
import webhookRouter from "./routers/webhook.router.ts";

const app: Application = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: CLIENT_URL,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
	}),
);

const apiRouter = Router();

apiRouter.get("/", (_req: Request, res: Response) => {
	res.send({
		message: `Welcome to ${APP_NAME}!`,
	});
});

const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per 15 minutes
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: { message: "Too many requests, please try again later." },
});

app.use("/api", globalLimiter);

app.use("/api", apiRouter);

// Route declarations
apiRouter.all("/auth/{*any}", toNodeHandler(auth));

apiRouter.use("/products", productRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/checkout", checkoutRouter);
apiRouter.use("/webhooks", webhookRouter);

apiRouter.use("/admin", adminRouter);

app.use((_req: Request, res: Response) => {
	res.status(404).json({ message: "Not found" });
});

app.use(errorNormalizer, appErrorHandler);

export default app;
