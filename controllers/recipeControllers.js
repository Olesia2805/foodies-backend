import { SUCCESS } from '../constants/messages.js';
import errorWrapper from '../helpers/errorWrapper.js';
import recipeService from '../services/recipeServices.js';

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
  deleteRecipe: errorWrapper(deleteRecipe),
  getRecipeById: errorWrapper(getRecipeById),
};
