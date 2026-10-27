import type { NextFunction, Request, Response } from "express";
import ProductService from "./product.service.ts";
import type { Role } from "../../generated/prisma/enums.ts";
import ProductRepository from "./product.repository.ts";
import AppError from "../../errors/app.error.ts";

class ProductController {
	static getAll = async (req: Request, res: Response, next: NextFunction) => {
		const page = req.query.page?.toString() || "1";
		const limit = req.query.limit?.toString() || "10";
		const search = req.query.search?.toString() || "";

		const { data, meta } = await ProductService.getPaginatedProducts({
			page: Number(page) || 1,
			limit: Number(limit) || 10,
			search,
		});

		res.send({
			message: "Products retrieved successfully!",
			data,
			meta,
		});
	};
	static getAllByOwnerId = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		const page = req.query.page?.toString() || "1";
		const limit = req.query.limit?.toString() || "10";
		const search = req.query.search?.toString() || "";

		const { data, meta } = await ProductService.getPaginatedProducts({
			page: Number(page) || 1,
			limit: Number(limit) || 10,
			search,
			role: req.user?.role as Role,
			ownerId: req.user?.id,
		});

		res.send({
			message: "Products by owner id retrieved successfully!",
			data,
			meta,
		});
	};
	static getById = async (req: Request, res: Response, next: NextFunction) => {
		const data = await ProductRepository.findById(req.params?.id as string);

		if (!data) {
			throw new AppError("Product not found", 404);
		}

		res.send({
			message: "Product retrieved successfully!",
			data,
		});
	};
	static create = async (req: Request, res: Response, next: NextFunction) => {
		const newProduct = await ProductRepository.create({
			...req.body,
			owner: { connect: { id: req.user?.id } },
		});

		res.status(201).send({
			message: "Product created successfully!",
			data: newProduct,
		});
	};
	static update = async (req: Request, res: Response, next: NextFunction) => {
		const updatedProduct = await ProductRepository.update(
			req.params?.id as string,
			req.body,
		);

		res.send({
			message: "Product updated successfully!",
			data: updatedProduct,
		});
	};
	static delete = async (req: Request, res: Response, next: NextFunction) => {
		await ProductRepository.delete(req.params?.id as string);

		res.status(204).send({
			message: "Product deleted successfully!",
		});
	};
}

export default ProductController;
