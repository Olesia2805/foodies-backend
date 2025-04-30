import errorWrapper from '../helpers/errorWrapper.js';
import recipeService from '../services/recipeServices.js';

const createRecipe = async (req, res) => {
  const { id: owner } = req.user;

  // Handle uploaded image
  let thumb = null;
  if (req.file) {
    const { filename } = req.file;
    thumb = `/recipes/${filename}`;
  }

  // Parse ingredients from form data
  const ingredients = JSON.parse(req.body.ingredients || '[]');

  // Prepare recipe data
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
  const { id: userId } = req.user;

  const recipes = await recipeService.getUserRecipes(userId);

  res.status(200).send({
    recipes,
  });
};

export default {
  createRecipe: errorWrapper(createRecipe),
  getUserRecipes: errorWrapper(getUserRecipes),
};
