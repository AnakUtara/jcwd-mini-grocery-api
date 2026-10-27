import type { Role } from "../../generated/prisma/enums.ts";
import { offsetPaginate } from "../../utils/paginate.utils.ts";
import ProductRepository from "./product.repository.ts";

class ProductService {
	static getPaginatedProducts = async (query: {
		page?: number;
		limit?: number;
		search?: string;
		role?: Role;
		ownerId?: string;
	}) => {
		const { page, limit, skip } = offsetPaginate({
			page: query.page || 1,
			limit: query.limit || 10,
		});

		const { items, total } = await ProductRepository.findAll({
			skip,
			take: limit,
			search: query.search?.trim() || "",
			roleFilter: query.role || undefined,
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
}

export default ProductService;
