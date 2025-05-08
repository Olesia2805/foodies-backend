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