import { Op } from 'sequelize';
import Recipe from '../db/models/Recipe.js';
import RecipeIngredient from '../db/models/RecipeIngredient.js';
import Category from '../db/models/Category.js';
import Area from '../db/models/Areas.js';
import Ingredient from '../db/models/Ingredient.js';
import HttpError from '../helpers/HttpError.js';
import sequelize from '../db/Sequelize.js';
import User from '../db/models/User.js';
import UserFavorites from '../db/models/UserFavorites.js';

import { ERROR, SUCCESS } from '../constants/messages.js';
import { calculatePagination } from '../helpers/paginationHelper.js';

//TODO errors

const getRecipes = async ({
  categoryId,
  areaId,
  userId,
  ingredientId,
  limit,
  offset,
}) => {
  // try {
  const where = {};

  if (categoryId) where.categoryId = categoryId;
  if (areaId) where.areaId = areaId;
  if (userId) where.userId = userId;

  if (ingredientId && Array.isArray(ingredientId) && ingredientId.length > 0) {
    const recipeIngredientLinks = await RecipeIngredient.findAll({
      where: {
        ingredientId: { [Op.in]: ingredientId },
      },
      attributes: ['recipeId'],
      group: ['recipeId'],
      raw: true,
    });

    const recipeIds = recipeIngredientLinks.map((item) => item.recipeId);

    if (recipeIds.length > 0) {
      where._id = { [Op.in]: recipeIds };
    } else {
      where._id = null;
    }
  }

  const { count, rows } = await Recipe.findAndCountAll({
    where,
    attributes: { exclude: ['userId'] },
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['_id', 'name', 'avatar'],
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });
  //TODO
  // if (!rows || rows.length === 0) {
  //   throw HttpError(404, ERROR.RECIPES_NOT_FOUND);
  // }

  const pages = Math.ceil(count / (limit || count || 1));
  const currentPage = limit ? Math.floor(offset / limit) + 1 : 1;

  return {
    total: count,
    pages,
    currentPage,
    data: rows,
  };
  // } catch (error) {
  //   throw HttpError(500, ERROR.RECIPES_NOT_FOUND || error.message);
  // }
};

const createRecipe = async (recipeData) => {
  const { ingredients, ...recipeFields } = recipeData;

  const t = await sequelize.transaction();
  let recipe = null;

  try {
    recipe = await Recipe.create(recipeFields, { transaction: t });

    if (ingredients && ingredients.length > 0) {
      const recipeIngredients = ingredients.map((item) => {
        //TODO
        // if (!item.ingredientId || !item.quantity) {
        //   throw HttpError(400, ERROR.INGREDIENT_NOT_FOUND);
        // }
        return {
          recipeId: recipe._id,
          ingredientId: item.ingredientId || item._id,
          quantity: item.quantity || item.measure,
        };
      });

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
    //TODO
    // throw HttpError(500, ERROR.RECIPE_CREATION_FAILED || error.message);
  }
};

const getUserRecipes = async (owner) => {
  return await Recipe.findAll({
    where: { userId: owner },
    include: [
      {
        model: RecipeIngredient,
        as: 'recipeIngredients',
        include: [
          {
            model: Ingredient,
            as: 'ingredient',
            attributes: ['_id', 'name', 'desc', 'img'],
          },
        ],
        attributes: ['measure'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

//TODO
// if (!recipes || recipes.length === 0) {
//   throw HttpError(404, ERROR.RECIPE_NOT_FOUND);
// }

const addToFavorites = async (user, recipeId) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) throw HttpError(400, ERROR.RECIPE_WITH_ID_NOT_FOUND(recipeId));

  const existingFavorite = await UserFavorites.findOne({
    where: {
      user_id: user._id,
      recipe_id: recipeId,
    },
  });

  if (existingFavorite) {
    throw HttpError(400, 'Recipe is already in your favorites');
  }

  return await UserFavorites.create({
    user_id: user._id,
    recipe_id: recipeId,
  });
};

const deleteFromFavorites = async (user, recipeId) => {
  const favorite = await UserFavorites.findOne({
    where: {
      user_id: user._id,
      recipe_id: recipeId,
    },
  });

  if (!favorite) {
    throw HttpError(400, ERROR.RECIPE_WITH_ID_NOT_FOUND(recipeId));
  }

  return await UserFavorites.destroy({
    where: {
      user_id: user._id,
      recipe_id: recipeId,
    },
  });
};

const getFavorites = async (user, filters = {}) => {
  const { rows, count } = await UserFavorites.findAndCountAll({
    where: {
      user_id: user._id,
    },
    include: [{ model: Recipe, as: 'recipe' }],
    ...filters,
  });

  // I suppouse empty array is not an error.
  // if (!rows || rows.length === 0) {
  //   throw HttpError(400, ERROR.FAVORITES_NOT_FOUND);
  // }

  const pages = Math.ceil(count / filters?.limit || 1);
  const currentPage = filters?.limit
    ? Math.floor(filters?.offset / filters?.limit) + 1
    : 1;

  const recipes = rows?.map((favorite) => favorite.recipe) || [];

  return {
    total: count,
    currentPage: currentPage,
    pages: pages,
    data: recipes,
  };
};

const deleteRecipe = async (recipeId, userId) => {
  const t = await sequelize.transaction();

  try {
    const recipe = await Recipe.findOne({
      where: {
        _id: recipeId,
        userId: userId,
      },
    });

    if (!recipe) {
      throw HttpError(404, ERROR.RECIPE_DELETE_PERMISSION_DENIED);
    }

    await RecipeIngredient.destroy({
      where: {
        recipeId: recipeId,
      },
      transaction: t,
    });

    await Recipe.destroy({
      where: {
        _id: recipeId,
        userId: userId,
      },
      transaction: t,
    });

    await t.commit();

    return { message: SUCCESS.RECIPE_DELETED };
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    throw error;
    //TODO
    // throw HttpError(500, ERROR.RECIPE_DELETION_FAILED || error.message);
  }
};

const getRecipeById = async (recipeId) => {
  const recipe = await Recipe.findByPk(recipeId, {
    include: [
      {
        model: Ingredient,
        through: { attributes: ['measure'] },
        as: 'ingredients',
      },
      {
        model: User,
        as: 'owner',
        attributes: ['_id', 'name', 'email', 'avatar'],
      },
      {
        model: Category,
        as: 'categoryOfRecipe',
        attributes: ['_id', 'name'],
      },
      {
        model: Area,
        as: 'areaOfRecipe',
        attributes: ['_id', 'name'],
      },
    ],
  });

  if (!recipe) {
    throw HttpError(404, ERROR.RECIPE_NOT_FOUND);
  }

  return recipe;
};

const getPopularRecipes = async () => {
  const popular = await UserFavorites.findAll({
    attributes: [
      'recipe_id',
      [sequelize.fn('COUNT', sequelize.col('user_id')), 'favoritesCount'],
    ],
    group: ['recipe_id'],
    order: [[sequelize.fn('COUNT', sequelize.col('user_id')), 'DESC']],
    limit: 4,
    raw: true,
  });

  if (!popular || popular.length === 0) {
    return [];
  }

  const recipeIds = popular.map((item) => item.recipe_id);

  const recipes = await Recipe.findAll({
    where: {
      _id: {
        [Op.in]: recipeIds,
      },
    },
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['_id', 'name', 'avatar'],
      },
    ],
  });

  return recipes;
};

export default {
  getRecipes,
  createRecipe,
  getUserRecipes,
  addToFavorites,
  deleteFromFavorites,
  getFavorites,
  deleteRecipe,
  getRecipeById,
  getPopularRecipes,
};
