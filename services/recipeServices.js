import Recipe from '../db/models/Recipe.js';
import RecipeIngredient from '../db/models/RecipeIngredient.js';
import Ingredient from '../db/models/Ingredient.js';
import HttpError from '../helpers/HttpError.js';
import sequelize from '../db/Sequelize.js';
import User from '../db/models/User.js';

const createRecipe = async (recipeData) => {
  const { ingredients, ...recipeFields } = recipeData;

  const t = await sequelize.transaction();
  let recipe = null;

  try {
    recipe = await Recipe.create(recipeFields, { transaction: t });

    if (ingredients && ingredients.length > 0) {
      const recipeIngredients = ingredients.map((item) => ({
        recipeId: recipe._id,
        ingredientId: item.ingredientId || item._id,
        quantity: item.quantity || item.measure,
      }));

      await RecipeIngredient.bulkCreate(recipeIngredients, { transaction: t });
    }

    await t.commit();

    return await Recipe.findByPk(recipe._id, {
      include: [{ model: Ingredient, through: { attributes: ['quantity'] } }],
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    throw HttpError(500, error.message);
  }
};

const getUserRecipes = async (owner) => {
  return await Recipe.findAll({
    where: { owner },
    include: [{ model: Ingredient, through: { attributes: ['quantity'] } }],
    order: [['createdAt', 'DESC']],
  });
};

const addToFavorites = async (userId, recipeId) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) throw HttpError(400, "Recipe not found")
  
  const user = await User.findByPk(userId);

  return user.addFavoriteRecipes(recipe);
}

const deleteFromFavorites = async (userId, recipeId) => {
  const user = await User.findByPk(userId);


  const isFavorite = await user.hasFavoriteRecipes(recipeId);
  if (!isFavorite) {
    throw HttpError(400, "Recipe is not in your favorites")
  }

  return user.removeFavoriteRecipes(recipeId);

}

const getFavorites = async (userId, filters = {}) => {
  const user = await User.findByPk(userId);

  const {rows, count} = await user.getFavoriteRecipes(filters);
  if (!rows) {
    throw HttpError(400, "Recipe is not in your favorites")
  }

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
}



export default {
  createRecipe,
  getUserRecipes,
  addToFavorites,
  deleteFromFavorites,
  getFavorites
};
