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
  const { _id: userId } = req.user;
  const { id } = req.body;

  const result = await recipeService.addToFavorites(userId, id)

  res.status(201).json({
    message: `Recipe ${id} added to favorite successfully`,
    result: result
  })

}

export default {
  createRecipe: errorWrapper(createRecipe),
  getUserRecipes: errorWrapper(getUserRecipes),
  addToFavorites: errorWrapper(addToFavorites),
};
