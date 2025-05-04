import Joi from 'joi';

export const createRecipeSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty',
  }),
  description: Joi.string().max(200).required().messages({
    'any.required': 'Description is required',
    'string.empty': 'Description cannot be empty',
    'string.max': 'Description must not exceed 200 characters',
  }),
  area: Joi.string().max(200).optional().messages({
    'string.max': 'Area must not exceed 200 characters',
  }),
  instructions: Joi.string().max(2000).required().messages({
    'any.required': 'Instructions are required',
    'string.empty': 'Instructions cannot be empty',
    'string.max': 'Instructions must not exceed 2000 characters',
  }),
  time: Joi.number().integer().min(1).required().messages({
    'any.required': 'Cooking time is required',
    'number.base': 'Cooking time must be a number',
    'number.integer': 'Cooking time must be an integer',
    'number.min': 'Cooking time must be at least 1 minute',
  }),
  category: Joi.string().required().messages({
    'any.required': 'Category is required',
    'string.empty': 'Category cannot be empty',
  }),
  ingredients: Joi.alternatives()
    .try(
      Joi.string().max(2000),
      Joi.array().items(
        Joi.object({
          ingredientId: Joi.string().required(),
          quantity: Joi.string().required(),
        })
      )
    )
    .required()
    .messages({
      'any.required': 'Ingredients are required',
      'string.empty': 'Ingredients cannot be empty',
      'string.max': 'Ingredients must not exceed 2000 characters',
    }),
});


export const addToFavorites = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    'any.required': 'Filed "id" is required',
    'number.base': 'Filed "id" must be an integer',
    'number.integer': 'Filed "id" must be an integer',
    'number.min': 'Filed "id" must be greater than or equal to 1',
  }),
});

//TODO area and category
// .valid('Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert')
// message
// 'any.only': 'Category must be one of [Breakfast, Lunch, Dinner, Snack, Dessert]',

//TODO
// ingredients: Joi.array()
//   .items(
//     Joi.object({
//       ingredientId: Joi.string().uuid().required().messages({
//         'any.required': 'Ingredient ID is required',
//         'string.empty': 'Ingredient ID cannot be empty',
//         'string.guid': 'Ingredient ID must be a valid UUID',
//       }),
//       quantity: Joi.string().max(50).required().messages({
//         'any.required': 'Quantity is required',
//         'string.empty': 'Quantity cannot be empty',
//         'string.max': 'Quantity must not exceed 50 characters',
//       }),
//     })
//   )
//   .min(1)
//   .required()
//   .messages({
//     'any.required': 'Ingredients are required',
//     'array.min': 'At least one ingredient is required',
//   }),

