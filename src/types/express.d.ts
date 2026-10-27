import type { auth } from "../lib/auth.ts";

type SessionData = typeof auth.$Infer.Session;

declare global {
	namespace Express {
		interface Request {
			user?: SessionData["user"];
			session?: SessionData["session"];
		}
	}
}
