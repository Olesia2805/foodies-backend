import Ingredient from '../db/models/Ingredient.js';
import HttpError from '../helpers/HttpError.js';

const listIngredients = async (query = {}, filters = { page: 0 }) => {
  const { count, rows } = await Ingredient.findAndCountAll({
    where: query,
    ...filters,
  });

  const pages = Math.ceil(count / filters?.limit || 1);

  return {
    data: rows,
    total: count,
    pages: pages,
  };
};

const oneIngredient = async (id) => {
  return Ingredient.findByPk(id);
};

export default {
  listIngredients,
  oneIngredient,
};
