import Joi from 'joi';

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
