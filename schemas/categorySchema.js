import Joi from 'joi';

const createCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Category name is required',
    'string.empty': 'Category name cannot be empty',
  }),
  description: Joi.string().optional().messages({
    'string.empty': 'Description cannot be empty',
  }),
});

export { createCategorySchema };