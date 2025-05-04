import Testimonial from '../db/models/testimonial.js';
import User from '../db/models/User.js';

const listTestimonials = async (filters = {}) => {
  const { limit, offset } = filters;
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
    ...(limit && { limit }),
    ...(offset && { offset }),
  });

  const totalPages = Math.ceil(count / (limit || count));
  const currentPage = limit ? Math.floor(offset / limit) + 1 : 1;

  return {
    total: count,
    currentPage: currentPage,
    pages: totalPages,
    data: testimonials,
  };
};

export default {
  listTestimonials,
};
