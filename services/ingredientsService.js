import Ingredient from '../db/models/Ingredient.js';

const listIngredients = async (query = {}, filters = {}) => {
  const { count, rows } = await Ingredient.findAndCountAll({
    where: query,
    ...filters,
  });

  const pages = Math.ceil(count / filters?.limit || 1);

  return {
    total: count,
    pages: pages,
    data: rows,
  };
};

const oneIngredient = async (id) => {
  return Ingredient.findByPk(id);
};

export default {
  listIngredients,
  oneIngredient,
};
