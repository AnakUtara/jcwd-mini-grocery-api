import prisma from "../../db/client.ts";
import type {
	ProductCreateInput,
	ProductUpdateInput,
	ProductWhereInput,
} from "../../generated/prisma/models.ts";
import type { FindAllPaginatedQueryParams } from "../../types/query-params.type.ts";

class ProductRepository {
	static findAll = async (params: FindAllPaginatedQueryParams) => {
		const { skip, take, search, roleFilter, userId } = params;

		let where: ProductWhereInput = {};

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		if (userId) {
			where.ownerId = userId;
		}

		if (roleFilter) {
			where.owner = { role: roleFilter };
		}

		const [items, total] = await Promise.all([
			prisma.product.findMany({
				where,
				skip,
				take,
				orderBy: { createdAt: "desc" },
			}),
			prisma.product.count({ where }),
		]);

		return { items, total };
	};
	static findByOwnerId = async (ownerId: string) => {
		return await prisma.product.findMany({
			where: {
				owner: {
					id: ownerId,
				},
			},
		});
	};
	static findById = async (id: string) => {
		return await prisma.product.findUnique({
			where: {
				id,
			},
		});
	};
	static create = async (data: ProductCreateInput) => {
		return await prisma.product.create({
			data,
		});
	};
	static update = async (id: string, data: ProductUpdateInput) => {
		return await prisma.product.update({
			where: {
				id,
			},
			data,
		});
	};
	static delete = async (id: string) => {
		return await prisma.product.delete({
			where: {
				id,
			},
		});
	};
}

export default ProductRepository;
