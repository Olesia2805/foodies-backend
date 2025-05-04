import testimonialsService from '../services/testimonialsService.js';
import errorWrapper from '../helpers/errorWrapper.js';
import HttpError from '../helpers/HttpError.js';
import { ERROR } from '../constants/messages.js';

const getTestimonials = async (req, res) => {
  let { page, limit } = req.query;
  const filters = {};
  filters.offset = 0;

  page = Number(page);
  limit = Number(limit);

  if (limit) {
    filters.limit = limit;
    if (page) {
      filters.offset = (page - 1) * limit;
    }
  }

  const data = await testimonialsService.listTestimonials(filters);

  if (!Array.isArray(data?.data) || data.data.length === 0) {
    throw HttpError(404, ERROR.TESTIMONIAL_NOT_FOUND);
  }

  res.status(200).json(data);
};

export default {
  getTestimonialsCtrl: errorWrapper(getTestimonials),
};
