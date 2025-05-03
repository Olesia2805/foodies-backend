import { ERROR } from '../constants/messages.js';
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

  const recipeData = {
    ...req.body,
    owner,
    thumb,
    ingredients,
  };

  const recipe = await recipeService.createRecipe(recipeData);

  res.status(201).send({
    recipe,
    message: 'Recipe created successfully',
  });
};

const getUserRecipes = async (req, res) => {
  const { _id: userId } = req.user;

  const recipes = await recipeService.getUserRecipes(userId);

  res.status(200).send({
    recipes,
  });
};

const addToFavorites = async (req, res) => {
  const { user } = req;
  const { id } = req.body;

  await recipeService.addToFavorites(user, id);

  res.status(201).json({
    message: `Recipe with Id: "${id}" added to favorite successfully`,
  });
};

const deleteFromFavorites = async (req, res) => {
  const { user } = req;
  const { id } = req.body;

  await recipeService.deleteFromFavorites(user, id);

  res.status(200).json({
    message: `Recipe with Id: "${id}" deleted from favorite successfully`,
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

  if (!Array.isArray(data?.data) || data.data.length === 0) {
    throw HttpError(404, ERROR.INGREDIENT_NOT_FOUND);
  }

  res.status(200).json(data);
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const result = await recipeService.deleteRecipe(id, userId);

  res.status(200).json(result);
};

export default {
  createRecipe: errorWrapper(createRecipe),
  getUserRecipes: errorWrapper(getUserRecipes),
  addToFavorites: errorWrapper(addToFavorites),
  deleteFromFavorites: errorWrapper(deleteFromFavorites),
  getFavorites: errorWrapper(getFavorites),
  deleteRecipe: errorWrapper(deleteRecipe),
};
