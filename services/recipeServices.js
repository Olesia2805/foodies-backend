import Recipe from '../db/models/Recipe.js';
import RecipeIngredient from '../db/models/RecipeIngredient.js';
import Ingredient from '../db/models/Ingredient.js';
import HttpError from '../helpers/HttpError.js';
import sequelize from '../db/Sequelize.js';

const createRecipe = async (recipeData) => {
  const { ingredients, ...recipeFields } = recipeData;

  const t = await sequelize.transaction();
  let recipe = null;

  try {
    recipe = await Recipe.create(recipeFields, { transaction: t });

    if (ingredients && ingredients.length > 0) {
      const recipeIngredients = ingredients.map((item) => ({
        recipeId: recipe._id,
        ingredientId: item.ingredientId || item._id,
        quantity: item.quantity || item.measure,
      }));

      await RecipeIngredient.bulkCreate(recipeIngredients, { transaction: t });
    }

    await t.commit();

    return await Recipe.findByPk(recipe._id, {
      include: [{ model: Ingredient, through: { attributes: ['quantity'] } }],
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
    include: [{ model: Ingredient, through: { attributes: ['quantity'] } }],
    order: [['createdAt', 'DESC']],
  });
};

export default {
  createRecipe,
  getUserRecipes,
};
