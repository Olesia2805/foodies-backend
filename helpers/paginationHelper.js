export const calculatePagination = (filters = {}, total = 0) => {
  const { page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);

  console.log('Pagination details:', { page, limit, offset, totalPages });

  return { page, limit, offset, totalPages };
};

export const formatPaginatedResponse = (data, { page, limit, totalPages, total }) => {
  return {
    metadata: {
      page,
      limit,
      totalPages,
      total,
    },
    data,
  };
};