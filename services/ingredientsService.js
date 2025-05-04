import Ingredient from '../db/models/Ingredient.js';
import { paginationSchema } from '../schemas/paginationSchema.js';
import { calculatePagination } from '../helpers/paginationHelper.js';

const listIngredients = async (query = {}, filters = {}) => {
  const { page, limit, offset } = calculatePagination(filters);

  const { count, rows } = await Ingredient.findAndCountAll({
    where: query,
    limit,
    offset,
  });

  const pages = Math.ceil(count / limit);

  return {
    total: count,
    currentPage: page,
    pages,
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
