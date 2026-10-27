import midtransClient from "midtrans-client";
import {
	IS_PROD,
	PAYGATE_CLIENT_KEY,
	PAYGATE_SERVER_KEY,
} from "../configs/env.config.ts";

export const snapClient = new midtransClient.Snap({
	isProduction: IS_PROD,
	serverKey: PAYGATE_SERVER_KEY,
	clientKey: PAYGATE_CLIENT_KEY,
});
