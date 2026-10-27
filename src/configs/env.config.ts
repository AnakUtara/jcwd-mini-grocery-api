import "dotenv/config";

export const APP_NAME = process.env.APP_NAME || "";
export const APP_PORT = process.env.APP_PORT || 3000;
export const APP_PUBLIC_URL =
	process.env.APP_PUBLIC_URL || "http://localhost:8000";
export const APP_ENV = process.env.APP_ENV || "development";

export const IS_PROD = process.env.APP_ENV === "production";

export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

export const DB_URL = process.env.DATABASE_URL || "";
export const DIRECT_URL = process.env.DIRECT_URL || "";

export const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || "";
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || "";

export const CLOUDINARY_URL = process.env.CLOUDINARY_URL || "";

export const REDIS_URL = process.env.REDIS_URL || "";

export const SMTP_HOST = process.env.SMTP_HOST || "";
export const SMTP_PORT = process.env.SMTP_PORT || "";
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";

export const PAYGATE_URL = process.env.PAYMENT_GATEWAY_URL || "";
export const PAYGATE_MERCHANT_ID =
	process.env.PAYMENT_GATEWAY_MERCHANT_ID || "";
export const PAYGATE_CLIENT_KEY = process.env.PAYMENT_GATEWAY_CLIENT_KEY || "";
export const PAYGATE_SERVER_KEY = process.env.PAYMENT_GATEWAY_SERVER_KEY || "";
