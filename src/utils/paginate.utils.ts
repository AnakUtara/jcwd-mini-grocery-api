export const offsetPaginate = (query: { page: number; limit: number }) => {
	const page = Math.max(1, Number(query?.page) || 1);
	const limit = Math.min(50, Math.max(1, Number(query?.limit) || 10));
	return {
		page,
		limit,
		skip: (page - 1) * limit,
	};
};
