import Recipe from '../db/models/Recipe.js';
import RecipeIngredient from '../db/models/RecipeIngredient.js';
import User from '../db/models/User.js';
import Category from '../db/models/Category.js';
import Area from '../db/models/Areas.js';
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

const getUserRecipes = async (userId) => {
  return await Recipe.findAll({
    where: { userId },
    include: [{ model: Ingredient, through: { attributes: ['measure'] }, as: "ingredients" }],
    order: [['createdAt', 'DESC']],
  });
};

const deleteRecipe = async (recipeId, userId) => {
  const t = await sequelize.transaction();

  try {
    const recipe = await Recipe.findOne({
      where: {
        _id: recipeId,
        userId: userId
      }
    });

    if (!recipe) {
      throw HttpError(404, 'Recipe not found or you do not have permission to delete it');
    }

    await RecipeIngredient.destroy({
      where: {
        recipeId: recipeId
      },
      transaction: t
    });

    await Recipe.destroy({
      where: {
        _id: recipeId,
        userId: userId
      },
      transaction: t
    });

    await t.commit();

    return { message: 'Recipe deleted successfully' };
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    throw error;
  }
};

const getRecipeById = async (recipeId) => {
  const recipe = await Recipe.findByPk(recipeId, {
    include: [
      { 
        model: Ingredient, 
        through: { attributes: ['measure'] },
        as: "ingredients"
      },
      {
        model: User,
        as: "owner",
        attributes: ["_id", "email", "avatar"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["_id", "name"]
      },
      {
        model: Area,
        as: "area",
        attributes: ["_id", "name"]
      }
    ],
  });

  if (!recipe) {
    throw HttpError(404, "Recipe not found");
  }

  return recipe;
};

export default {
  createRecipe,
  getUserRecipes,
  deleteRecipe,
  getRecipeById,
};
