import { createLogger, format, transports } from "winston";
import path from "path";
import { IS_PROD } from "../configs/env.config.ts";

// Helper replacer to strip circular references and noisy Express properties
const getSafeReplacer = () => {
	const seen = new WeakSet();
	return (key: string, value: unknown) => {
		// Drop heavy circular HTTP objects if passed accidentally
		if (
			key === "req" ||
			key === "res" ||
			key === "socket" ||
			key === "client"
		) {
			return "[HTTP Object]";
		}
		if (typeof value === "object" && value !== null) {
			if (seen.has(value)) {
				return "[Circular]";
			}
			seen.add(value);
		}
		return value;
	};
};

const logFormat = format.printf(
	({ level, message, timestamp, stack, ...metadata }) => {
		const metaKeys = Object.keys(metadata);
		let metaString = "";

		if (metaKeys.length > 0) {
			try {
				metaString = JSON.stringify(metadata, getSafeReplacer());
			} catch {
				metaString = "[Serialization Error]";
			}
		}

		// Display stack trace if available (from format.errors), otherwise normal message
		const outputMessage = stack || message;

		return `${timestamp} [${level.toUpperCase()}]: ${outputMessage} ${metaString}`;
	},
);

const logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.errors({ stack: true }),
		format.splat(),
		logFormat,
	),
	transports: [
		new transports.File({
			level: "error",
			filename: path.join(process.cwd(), "src/logs/error.log"),
		}),
		new transports.File({
			filename: path.join(process.cwd(), "src/logs/combined.log"),
		}),
	],
});

if (!IS_PROD) {
	logger.add(
		new transports.Console({
			format: format.combine(format.colorize(), logFormat),
		}),
	);
}

export default logger;
