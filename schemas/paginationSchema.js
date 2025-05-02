import Joi from 'joi';
import { MIN_LIMITS, MIN_PAGE } from '../constants/defaults.js';

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(MIN_PAGE).messages({
    'number.base': "Query parameter 'page' must be a number or is not set",
    'number.integer': "Query parameter 'page' must be an integer",
    'number.min': "Query parameter 'page' must be greater than or equal to 1",
  }),
  limit: Joi.number().integer().min(MIN_LIMITS).messages({
    'number.base': "Query parameter 'limit' must be a number or is not set",
    'number.integer': "Query parameter 'limit' must be an integer",
    'number.min': "Query parameter 'limit' must be greater than or equal to 1",
  }),
});
