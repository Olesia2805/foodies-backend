import Joi from 'joi';
import { MIN_LIMITS, MIN_PAGE } from '../constants/defaults.js';

export const ingredientsGetAll = Joi.object({
  page: Joi.number().integer().min(MIN_PAGE).messages({
    'number.base': "Query parameter 'page' must be a number or is not set",
    'number.integer': "Query parameter 'page' must be an integer",
    'number.min': "Query parameter 'page' must be at least 1",
  }),
  limit: Joi.number().integer().min(MIN_LIMITS).messages({
    'number.base': "Query parameter 'limit' must be a number or is not set",
    'number.integer': "Query parameter 'limit' must be an integer",
    'number.min': "Query parameter 'limit' must be at least 1",
  }),
});

export const ingredientsGetList = Joi.object({
  ids: Joi.alternatives()
    .try(Joi.array().items(Joi.string().min(1).required()), Joi.string().min(1))
    .required()
    .messages({
      'alternatives.types':
        "Query parameter 'ids' must be an array or a single string",
      'array.base': "Query parameter 'ids' must be an array",
      'array.includes': "All items in 'ids' must be non-empty strings",
      'string.base': "Query parameter 'ids' must be a string",
      'string.empty': "Query parameter 'ids' cannot be empty",
      'any.required': "Query parameter 'ids' is required",
    }),
});
