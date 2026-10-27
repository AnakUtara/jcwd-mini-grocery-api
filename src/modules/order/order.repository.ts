import prisma from "../../db/client.ts";
import type { Prisma } from "../../generated/prisma/client.ts";
import type {
	OrderCreateInput,
	OrderUpdateInput,
	OrderWhereInput,
} from "../../generated/prisma/models.ts";
import type { FindAllPaginatedQueryParams } from "../../types/query-params.type.ts";

class OrderRepository {
	static findAll = async (params: FindAllPaginatedQueryParams) => {
		const { skip, take, search, userId } = params;

		let where: OrderWhereInput = {};

		if (search) {
			where.OR = [
				{ totalAmount: { equals: Number(search) } },
				{ customer: { name: { contains: search, mode: "insensitive" } } },
			];
		}

		if (userId) {
			where.customerId = userId;
		}

		const [items, total] = await Promise.all([
			prisma.order.findMany({
				where,
				skip,
				take,
				orderBy: { createdAt: "desc" },
			}),
			prisma.order.count({ where }),
		]);

		return { items, total };
	};
	static findById = async (id: string) => {
		return await prisma.order.findUnique({
			where: {
				id,
			},
		});
	};
	static create = async (data: OrderCreateInput) => {
		return await prisma.order.create({
			data,
		});
	};
	static update = async (
		id: string,
		data: OrderUpdateInput,
		tx?: Prisma.TransactionClient,
	) => {
		const client = tx ?? prisma;
		return await client.order.update({
			where: {
				id,
			},
			data,
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	};
	static delete = async (id: string) => {
		return await prisma.order.delete({
			where: {
				id,
			},
		});
	};
}

export default OrderRepository;
