import buildUploader from "../factories/uploader.factory.ts";

export const imageUploader = (
	allowedMimeTypes: string[] = [
		"image/jpg",
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/gif",
	],
	maxFileSize: number = 1.5,
) => buildUploader(allowedMimeTypes, maxFileSize);

export const fileUploader = (
	allowedMimeTypes: string[] = [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	],
	maxFileSize: number = 10,
) => buildUploader(allowedMimeTypes, maxFileSize);
