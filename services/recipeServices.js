import Recipe from '../db/models/Recipe.js';
import RecipeIngredient from '../db/models/RecipeIngredient.js';
import HttpError from '../helpers/HttpError.js';
import sequelize from '../db/Sequelize.js';
import User from '../db/models/User.js';

const createRecipe = async (recipeData) => {
  const { ingredients, ...recipeFields } = recipeData;

  const t = await sequelize.transaction();
  let recipe = null;

  try {
    recipe = await Recipe.create(recipeFields, { transaction: t });

    if (ingredients && ingredients.length > 0) {
      const recipeIngredients = ingredients.map((item) => ({
        recipeId: recipe.id,
        ingredientId: item.ingredientId || item.id,
        quantity: item.quantity || item.measure,
      }));

      await RecipeIngredient.bulkCreate(recipeIngredients, { transaction: t });
    }

    await t.commit();

    return await Recipe.findByPk(recipe.id, {
      include: [{ model: Ingredient }],
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    throw HttpError(500, error.message);
  }
};

const getUserRecipes = async (owner) => {
  return await Recipe.findAll({
    where: { owner },
    include: [{ model: Ingredient }],
    order: [['createdAt', 'DESC']],
  });
};

const ddToFavorites = async (userId, recipeId) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) throw HttpError(400, "Recipe not found")
  
  const user = await User.findByPk(userId);
  const result = await user.addFavorite(recipe);

  console.log('result :>> ', result);

  return result
}

export default {
  createRecipe,
  getUserRecipes,
  ddToFavorites,
};
