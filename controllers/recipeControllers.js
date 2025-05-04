import { ERROR, SUCCESS } from '../constants/messages.js';
import errorWrapper from '../helpers/errorWrapper.js';
import recipeService from '../services/recipeServices.js';

const createRecipe = async (req, res) => {
  const { _id: owner } = req.user;

  let thumb = null;
  if (req.file) {
    const { filename } = req.file;
    thumb = `/recipes/${filename}`;
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
  createRecipe: errorWrapper(createRecipe),
  getUserRecipes: errorWrapper(getUserRecipes),
  addToFavorites: errorWrapper(addToFavorites),
  deleteFromFavorites: errorWrapper(deleteFromFavorites),
  getFavorites: errorWrapper(getFavorites),
  deleteRecipe: errorWrapper(deleteRecipe),
  getRecipeById: errorWrapper(getRecipeById),
};
