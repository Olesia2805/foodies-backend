import { SUCCESS, ERROR } from '../constants/messages.js';
import errorWrapper from '../helpers/errorWrapper.js';
import HttpError from '../helpers/HttpError.js';
import recipeService from '../services/recipeServices.js';

const getRecipes = async (req, res) => {
  let { page, limit, categoryId, areaId, ingredientId } = req.query;

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

  const recipes = await recipeService.getUserRecipes(userId);

  //TODO
  // if (!recipes || recipes.length === 0) {
  //   return res.status(404).json({ message: 'No recipes found for this user' });
  // }

  res.status(200).send({
    recipes,
  });
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

const getRecipes = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const recipes = await recipeService.listRecipes({ page: Number(page), limit: Number(limit) });

  res.status(200).json(recipes);
};

export default {
  getRecipes: errorWrapper(getRecipes),
  createRecipe: errorWrapper(createRecipe),
  getUserRecipes: errorWrapper(getUserRecipes),
  deleteRecipe: errorWrapper(deleteRecipe),
  getRecipeById: errorWrapper(getRecipeById),
  getRecipes: errorWrapper(getRecipes),
};
