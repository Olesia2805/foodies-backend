import Recipe from '../db/models/Recipe.js';
import RecipeIngredient from '../db/models/RecipeIngredient.js';
import Ingredient from '../db/models/Ingredient.js';
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

const addToFavorites = async (userId, recipeId) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) throw HttpError(400, "Recipe not found")
  
  const user = await User.findByPk(userId);
  // console.log(user)
  // console.log(typeof user)
  // console.log('Own properties:', Object.getOwnPropertyNames(user))
  // console.log('Prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(user)))

  const result = await user.addFavoriteRecipes(recipe);

  console.log('result :>> ', result);

  return result
}



export default {
  createRecipe,
  getUserRecipes,
  addToFavorites
};
