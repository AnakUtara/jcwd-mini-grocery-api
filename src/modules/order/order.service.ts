import { offsetPaginate } from "../../utils/paginate.utils.ts";
import OrderRepository from "./order.repository.ts";

class OrderService {
	static getPaginatedOrders = async (query: {
		page?: number;
		limit?: number;
		search?: string;
		ownerId?: string;
	}) => {
		const { page, limit, skip } = offsetPaginate({
			page: query.page || 1,
			limit: query.limit || 10,
		});

		const { items, total } = await OrderRepository.findAll({
			skip,
			take: limit,
			search: query.search?.trim() || "",
			...(query.ownerId && { userId: query.ownerId }),
		});

		const totalPages = Math.ceil(total / limit);

		return {
			data: items,
			meta: {
				page,
				limit,
				totalItems: total,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
			},
		};
	};
	static getById = async (id: string) => {
		return await OrderRepository.findById(id);
	};
}

export default OrderService;
