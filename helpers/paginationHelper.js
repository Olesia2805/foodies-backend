export const calculatePagination = (filters = {}) => {
  const { page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};