import type { Request } from "express";
import multer, {
	memoryStorage,
	type FileFilterCallback,
	type Multer,
} from "multer";
import AppError from "../errors/app.error.ts";

const buildUploader = (allowedMimeTypes: string[], maxFileSize: number) => {
	const fileFilter = (
		_req: Request,
		file: Express.Multer.File,
		cb: FileFilterCallback,
	) => {
		if (!allowedMimeTypes.includes(file.mimetype)) {
			cb(
				new AppError(
					`Invalid file type! Allowed file types: ${allowedMimeTypes.join(", ")}.`,
					400,
				),
			);
		} else {
			cb(null, true);
		}
	};

	const ONE_MB = 1024 ** 2;
	const limits = { fileSize: maxFileSize * ONE_MB };
	return multer({ fileFilter, limits, storage: memoryStorage() }) as Multer;
};

export default buildUploader;
