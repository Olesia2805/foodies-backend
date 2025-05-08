import Testimonial from '../db/models/Testimonial.js';
import User from '../db/models/User.js';
import { calculatePagination } from '../helpers/paginationHelper.js';
import { formatPaginatedResponse } from '../helpers/responseHelper.js';

const listTestimonials = async (filters = {}) => {
  const { page, limit, offset, totalPages } = calculatePagination(filters);

  const { count, rows: testimonials } = await Testimonial.findAndCountAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['_id', 'name', 'email', 'avatar'],
        required: false,
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });



  return formatPaginatedResponse({ testimonials }, {
    page,
    limit,
    totalPages,
    total: count,
  });
};

export default {
  listTestimonials,
};
