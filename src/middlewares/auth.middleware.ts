import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth.ts";
import { fromNodeHeaders } from "better-auth/node";
import AppError from "../errors/app.error.ts";
import type { Role } from "../generated/prisma/enums.ts";

export const authenticate = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	const sessionData = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});

	if (!sessionData) {
		throw new AppError("Unauthorized: Invalid or expired session", 401);
	}

	req.user = sessionData.user;
	req.session = sessionData.session;

	next();
};

export const requireRole = (allowedRoles: Role[]) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		if (!req.user) {
			throw new AppError("Unauthorized: Invalid or expired session", 401);
		}

		const userRole = req.user.role as Role;

		if (!allowedRoles.includes(userRole)) {
			throw new AppError("Forbidden: Insufficient permission", 403);
		}

		next();
	};
};
