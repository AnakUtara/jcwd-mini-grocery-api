import type { Role } from "../generated/prisma/enums.ts";

export type FindAllPaginatedQueryParams = {
	skip: number;
	take: number;
	search?: string;
	roleFilter?: Role;
	userId?: string;
};
