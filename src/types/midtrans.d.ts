import "midtrans-client";

declare module "midtrans-client" {
	// Extend the existing Snap class definition
	interface Snap {
		transaction: {
			/**
			 * Parses and validates Midtrans HTTP notification payloads (Webhooks).
			 * @param mockNotificationObj The raw JSON body object from req.body
			 */
			notification(
				mockNotificationObj: any,
			): Promise<MidtransNotificationResponse>;

			/**
			 * Checks the current real-time status of a transaction directly from Midtrans.
			 * @param orderIdOrTxId Your unique order_id or Midtrans transaction_id
			 */
			status(orderIdOrTxId: string): Promise<MidtransNotificationResponse>;
		};
	}

	// Define a type-safe structure for the response payload returned by Midtrans
	export interface MidtransNotificationResponse {
		transaction_time: string;
		transaction_status:
			| "capture"
			| "settlement"
			| "pending"
			| "deny"
			| "cancel"
			| "expire"
			| "refund"
			| "partial_refund";
		status_message: string;
		status_code: string;
		signature_key: string;
		payment_type: string;
		order_id: string;
		merchant_id: string;
		gross_amount: string;
		fraud_status?: "accept" | "deny" | "challenge";
		currency: string;
		// QRIS specific fields
		acquirer?: string;
	}
}
