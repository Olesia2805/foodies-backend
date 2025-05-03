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

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const result = await recipeService.deleteRecipe(id, userId);

  res.status(200).json(result);
};

export default {
  createRecipe: errorWrapper(createRecipe),
  getUserRecipes: errorWrapper(getUserRecipes),
  deleteRecipe: errorWrapper(deleteRecipe),
};
