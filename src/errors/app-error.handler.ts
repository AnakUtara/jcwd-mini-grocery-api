import type { NextFunction, Request, Response } from "express";
import AppError from "./app.error.ts";
import { ZodError } from "zod";
import type { $ZodIssue } from "zod/v4/core";
import { Prisma } from "../generated/prisma/client.ts";
import logger from "../utils/logger.ts";

export const errorNormalizer = (
	error: AppError,
	_req: Request,
	_res: Response,
	next: NextFunction,
) => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		switch (error.code) {
			case "P2002":
				return next(new AppError("Already exists", 409, error));
			case "P2025":
				return next(new AppError("Record not found", 404, error));
			default:
				return next(new AppError("Database error", 400, error));
		}
	}

	if (error instanceof Prisma.PrismaClientValidationError) {
		return next(
			new AppError(
				"Data not found/Invalid data provided: " + error.message,
				400,
				error,
			),
		);
	}

	if (error instanceof ZodError) {
		const messages = error.issues
			.map((err: $ZodIssue) => `${err.path.join(" ")}: ${err.message}`)
			.join("; ");

		return next(new AppError(messages, 400, error.issues));
	}

	return next(error);
};

const appErrorHandler = (
	error: AppError,
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	logger.error(
		`[${error.status || 500}] ${req.method} ${req.originalUrl} - ${error.message}`,
		error,
	);

	console.table(error);

	return res.status(error.status || 500).send({
		status: error.status || 500,
		message: error.message || "Internal Server Error",
		error: error.object || null,
	});
};

export default appErrorHandler;
