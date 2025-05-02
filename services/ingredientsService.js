import Ingredient from '../db/models/Ingredient.js';

const listIngredients = async (query = {}, filters = {}) => {
  const { count, rows } = await Ingredient.findAndCountAll({
    where: query,
    ...filters,
  });

  const pages = Math.ceil(count / filters?.limit || 1);
  const currentPage = filters?.limit
    ? Math.floor(filters?.offset / filters?.limit) + 1
    : 1;

  return {
    total: count,
    currentPage: currentPage,
    pages: pages,
    data: rows,
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
