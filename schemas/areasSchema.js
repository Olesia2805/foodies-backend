import Joi from 'joi';

export const areasGetByName = Joi.object({
  name: Joi.string().required().messages({
    'any.required': "Query parameter 'name' is required",
    'string.empty': "Query parameter 'name' cannot be empty",
  }),
});
