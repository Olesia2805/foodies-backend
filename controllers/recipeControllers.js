import { SUCCESS, ERROR } from '../constants/messages.js';
import errorWrapper from '../helpers/errorWrapper.js';
import HttpError from '../helpers/HttpError.js';
import recipeService from '../services/recipeServices.js';

const getRecipes = async (req, res) => {
  const { page = 1, limit = 10, categoryId, areaId, ingredientId, userId } = req.query;

  const filters = {
    page: Number(page),
    limit: Number(limit),
    categoryId,
    areaId,
    ingredientId: ingredientId ? ingredientId.split(',') : null,
    userId: userId ?? null,
  };

  const data = await recipeService.getRecipes(filters);

  res.status(200).json(data);
};

const createRecipe = async (req, res) => {
  const { _id: owner } = req.user;

  let thumb = null;
  if (req.file) {
    thumb = req.file.path;
  }

  const ingredients = JSON.parse(req.body.ingredients || '[]');

  //TODO
  // try {
  //   ingredients = JSON.parse(req.body.ingredients || '[]');
  // } catch (error) {
  //   return res.status(400).json({ message: 'Invalid ingredients format' });
  // }

  const recipeData = {
    ...req.body,
    owner,
    thumb,
    ingredients,
  };

  const recipe = await recipeService.createRecipe(recipeData);

  res.status(201).send({
    recipe,
    message: SUCCESS.RECIPE_CREATED,
  });
};

const getUserRecipes = async (req, res) => {
  const { _id: userId } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const filters = { page: Number(page), limit: Number(limit) };

  const data = await recipeService.getUserRecipes(userId, filters);

  res.status(200).json(data);
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

export default {
  getRecipes: errorWrapper(getRecipes),
  createRecipe: errorWrapper(createRecipe),
  getUserRecipes: errorWrapper(getUserRecipes),
  addToFavorites: errorWrapper(addToFavorites),
  deleteFromFavorites: errorWrapper(deleteFromFavorites),
  getFavorites: errorWrapper(getFavorites),
  deleteRecipe: errorWrapper(deleteRecipe),
  getRecipeById: errorWrapper(getRecipeById),
};
