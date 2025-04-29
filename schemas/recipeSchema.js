import Joi from "joi";

export const createRecipeSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required",
    "string.empty": "Title cannot be empty",
  }),
  description: Joi.string().max(200).required().messages({
    "any.required": "Description is required",
    "string.empty": "Description cannot be empty",
    "string.max": "Description must not exceed 200 characters",
  }),
  instructions: Joi.string().max(2000).required().messages({
    "any.required": "Instructions are required",
    "string.empty": "Instructions cannot be empty",
    "string.max": "Instructions must not exceed 2000 characters",
  }),
  cookingTime: Joi.number().integer().min(1).required().messages({
    "any.required": "Cooking time is required",
    "number.base": "Cooking time must be a number",
    "number.integer": "Cooking time must be an integer",
    "number.min": "Cooking time must be at least 1 minute",
  }),
  categoryId: Joi.number().integer().required().messages({
    "any.required": "Category is required",
    "number.base": "Category must be a number",
    "number.integer": "Category must be an integer",
  }),
  ingredients: Joi.array().items(
    Joi.object({
      ingredientId: Joi.number().integer().required().messages({
        "any.required": "Ingredient ID is required",
        "number.base": "Ingredient ID must be a number",
        "number.integer": "Ingredient ID must be an integer",
      }),
      quantity: Joi.string().required().messages({
        "any.required": "Quantity is required",
        "string.empty": "Quantity cannot be empty",
      }),
    })
  ).min(1).required().messages({
    "any.required": "At least one ingredient is required",
    "array.min": "At least one ingredient is required",
  }),
});
