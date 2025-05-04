import testimonialsService from '../services/testimonialsService.js';
import errorWrapper from '../helpers/errorWrapper.js';
import HttpError from '../helpers/HttpError.js';
import { ERROR } from '../constants/messages.js';
import { paginationSchema } from '../schemas/paginationSchema.js';

const getTestimonials = async (req, res) => {
  const { page, limit } = await paginationSchema.validateAsync(req.query);

  const filters = { page, limit };

  const data = await testimonialsService.listTestimonials(filters);

  if (!Array.isArray(data?.data) || data.data.length === 0) {
    throw HttpError(404, ERROR.INGREDIENT_NOT_FOUND);
  }

  res.status(200).json(data);
};

export default {
  getTestimonialsCtrl: errorWrapper(getTestimonials),
};
