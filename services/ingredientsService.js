import Ingredient from '../db/models/Ingredient.js';

const listIngredients = async (query = {}) => {
  const ingredients = await Ingredient.findAll({
    where: query,
  });

  return {
    total: ingredients.length,
    data: ingredients,
  };
};

const oneIngredient = async (id) => {
  const ingredientId = await Ingredient.findByPk(id);
  return ingredientId;
};

export default {
  listIngredients,
  oneIngredient,
};