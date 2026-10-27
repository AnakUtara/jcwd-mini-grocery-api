import { Redis, ReplyError } from "ioredis";
import { REDIS_URL } from "../configs/env.config.ts";

const redis = new Redis(REDIS_URL!);

redis.on("error", (error: unknown) => {
	if (error instanceof ReplyError) {
		console.error("Redis Server Error Code:", error); // e.g., "WRONGTYPE..."
	} else if (error instanceof Error && "code" in error) {
		console.error("Network Error Code:", (error as any).code); // e.g., "ECONNREFUSED"
	} else {
		console.error("Generic Error:", error);
	}
});

export default redis;
