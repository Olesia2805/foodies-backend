import Testimonial from '../db/models/testimonial.js';
import User from '../db/models/User.js';
import { paginationSchema } from '../schemas/paginationSchema.js';
import { calculatePagination } from '../helpers/paginationHelper.js';

const listTestimonials = async (filters = {}) => {
  const { page, limit, offset } = calculatePagination(filters);

  const { count, rows: testimonials } = await Testimonial.findAndCountAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['_id', 'name','email', 'avatar'],
        required: false,
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  const totalPages = Math.ceil(count / limit);

  return {
    total: count,
    currentPage: page,
    pages: totalPages,
    data: testimonials,
  };
};

export default {
  listTestimonials,
};
