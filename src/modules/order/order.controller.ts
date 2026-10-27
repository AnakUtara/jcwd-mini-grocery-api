import type { NextFunction, Request, Response } from "express";
import OrderService from "./order.service.ts";

class OrderController {
	static getAll = async (req: Request, res: Response, next: NextFunction) => {
		const page = req.query.page?.toString() || "1";
		const limit = req.query.limit?.toString() || "10";
		const search = req.query.search?.toString() || "";

		const { data, meta } = await OrderService.getPaginatedOrders({
			page: Number(page) || 1,
			limit: Number(limit) || 10,
			search,
		});

		res.send({
			message: "Orders retrieved successfully!",
			data,
			meta,
		});
	};
	static getAllByCustomerID = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		const page = req.query.page?.toString() || "1";
		const limit = req.query.limit?.toString() || "10";
		const search = req.query.search?.toString() || "";

		const { data, meta } = await OrderService.getPaginatedOrders({
			page: Number(page) || 1,
			limit: Number(limit) || 10,
			search,
			ownerId: req.user?.id,
		});

		res.send({
			message: "Orders retrieved successfully!",
			data,
			meta,
		});
	};
	static getById = async (req: Request, res: Response, next: NextFunction) => {
		const order = await OrderService.getById(req.params.id as string);

		res.send({
			message: "Order retrieved successfully!",
			data: order,
		});
	};
}

export default OrderController;
