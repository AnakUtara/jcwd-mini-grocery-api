import { v2 as Cloudinary } from "cloudinary";
import { APP_NAME } from "../configs/env.config.ts";

export const uploadToCloudinary = (
	fileBuffer: Buffer,
	folder: string = "grocery-items",
	baseDir: string = `${APP_NAME}`,
): Promise<{ url: string; publicId: string }> => {
	return new Promise((resolve, reject) => {
		const uploadStream = Cloudinary.uploader.upload_stream(
			{ folder: baseDir + folder },
			(error, result) => {
				if (error || !result) return reject(error);
				resolve({
					url: result.secure_url,
					publicId: result.public_id,
				});
			},
		);

		uploadStream.end(fileBuffer);
	});
};

export default Cloudinary;
