import { SUCCESS, ERROR } from '../constants/messages.js';
import errorWrapper from '../helpers/errorWrapper.js';
import HttpError from '../helpers/HttpError.js';
import recipeService from '../services/recipeServices.js';

const getRecipes = async (req, res) => {
  let { page, limit, categoryId, areaId, ingredientId, userId } = req.query;

  const filters = {};
  filters.offset = 0;

  page = Number(page);
  limit = Number(limit);

  if (limit) {
    filters.limit = limit;

    if (page) {
      filters.offset = (page - 1) * limit;
    }
  }

  const filterOptions = {
    categoryId,
    areaId,
    ingredientId: ingredientId ? ingredientId.split(',') : null,
    userId: userId ?? null,
    ...filters,
  };

  const data = await recipeService.getRecipes(filterOptions);

  if (!Array.isArray(data?.data) || data.data.length === 0) {
    throw HttpError(404, ERROR.RECIPES_NOT_FOUND);
  }

  res.json(data);
};

const createRecipe = async (req, res) => {
  const { _id: owner } = req.user;

  let thumb = null;
  if (req.file) {
    thumb = req.file.path;
  }

  let ingredients = req.body.ingredients;
  if (typeof ingredients === 'string') {
    ingredients = JSON.parse(ingredients || '[]');
  }

  const categoryId = await recipeService.getCategoryIdByName(req.body.category);
  const areaId = await recipeService.getAreaIdByName(req.body.area);

  if (!categoryId || !areaId) {
    throw new Error('Invalid category or area');
  }

  const recipeData = {
    ...req.body,
    owner,
    thumb,
    ingredients,
    categoryId,
    areaId,
    userId: owner,
  };

  const recipe = await recipeService.createRecipe(recipeData);

  res.status(201).send({
    recipe,
    message: SUCCESS.RECIPE_CREATED,
  });
};

const getUserRecipes = async (req, res) => {
  const { _id: userId } = req.user;

  const recipes = await recipeService.getUserRecipes(userId);

  //TODO
  // if (!recipes || recipes.length === 0) {
  //   return res.status(404).json({ message: 'No recipes found for this user' });
  // }

  res.status(200).send({
    recipes,
  });
};

const addToFavorites = async (req, res) => {
  const { user } = req;
  const { id } = req.body;

  await recipeService.addToFavorites(user, id);

  res.status(201).json({
    message: SUCCESS.RECIPE_FAVORITES_ADDED(id),
  });
};

const deleteFromFavorites = async (req, res) => {
  const { user } = req;
  const { id } = req.body;

  await recipeService.deleteFromFavorites(user, id);

  res.status(200).json({
    message: SUCCESS.RECIPE_FAVORITES_DELETED(id),
  });
};

const getFavorites = async (req, res) => {
  let { page, limit } = req.query;
  const filters = {};
  filters.offset = 0;

  page = Number(page);
  limit = Number(limit);

  if (limit) {
    filters.limit = limit;
    if (page) {
      filters.offset = (page - 1) * limit;
    }
  }

  const data = await recipeService.getFavorites(req.user, filters);

  res.status(200).json(data);
};

const deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user._id;

  const result = await recipeService.deleteRecipe(recipeId, userId);

  //TODO
  // if (!result) {
  //   return res.status(404).json({ message: 'Recipe not found or permission denied' });
  // }
  // res.status(200).json({
  //   message: SUCCESS.RECIPE_DELETED,
  // });

  res.status(200).json(result);
};

const getRecipeById = async (req, res) => {
  const { recipeId } = req.params;

  const recipe = await recipeService.getRecipeById(recipeId);

  //TODO
  // if (!recipe) {
  //   return res.status(404).json({ message: 'Recipe not found' });
  // }

  res.status(200).send({
    recipe,
  });
};

const getPopularRecipes = async (req, res) => {
  const data = await recipeService.getPopularRecipes();

  if (!Array.isArray(data) || data.length === 0) {
    throw HttpError(404, ERROR.RECIPES_NOT_FOUND);
  }

  res.json(data);
};

export default {
  getRecipes: errorWrapper(getRecipes),
  createRecipe: errorWrapper(createRecipe),
  getUserRecipes: errorWrapper(getUserRecipes),
  addToFavorites: errorWrapper(addToFavorites),
  deleteFromFavorites: errorWrapper(deleteFromFavorites),
  getFavorites: errorWrapper(getFavorites),
  deleteRecipe: errorWrapper(deleteRecipe),
  getRecipeById: errorWrapper(getRecipeById),
  getPopularRecipes: errorWrapper(getPopularRecipes),
};
