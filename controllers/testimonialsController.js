import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from '../constants/defaults.js';
import Testimonial from '../db/models/testimonial.js';
import User from '../db/models/User.js';
import errorWrapper from '../helpers/errorWrapper.js';
import HttpError from '../helpers/HttpError.js';

// Отримання списку відгуків
const getTestimonials = async (req, res) => {
  const page = parseInt(req.query.page) || PAGINATION_DEFAULT_PAGE;
  const limit = parseInt(req.query.limit) || PAGINATION_DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  const { count, rows: testimonials } = await Testimonial.findAndCountAll({
    // attributes: ['testimonial'],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['_id', 'email', 'avatar'],
        required: false,
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  const totalPages = Math.ceil(count / limit);

  res.json({
    status: 'success',
    code: 200,
    data: {
      testimonials,
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages,
        itemsPerPage: limit,
      },
    },
  });
};

// Експортуємо функції, обгорнуті в errorWrapper
export default {
  getTestimonialsCtrl: errorWrapper(getTestimonials),
};
