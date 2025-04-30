import Joi from 'joi';

export const ingredientsGetAll = Joi.object({
  page: Joi.number().integer().min(1).messages({
    'number.base': "Query parameter 'page' is a number or is not set",
    'number.integer': "Query parameter 'page' must be an integer",
    'number.min': "Query parameter 'page' must be at least 1",
  }),
  limit: Joi.number().integer().min(1).messages({
    'number.base': "Query parameter 'limit' is a number or is not set",
    'number.integer': "Query parameter 'limit' must be an integer",
    'number.min': "Query parameter 'limit' must be at least 1",
  }),
});

export const ingredientsGetList = Joi.object({
  ids: Joi.array().items(Joi.string()).required().messages({
    'array.base': "Query parameter 'ids' must be an array",
    'array.includes': "All items in 'ids' must be non-empty strings",
    'any.required': "Query parameter 'ids' is required",
    'string.base': "Each item in 'ids' must be a string",
    'string.empty': "Items in 'ids' cannot be empty",
  }),
});
