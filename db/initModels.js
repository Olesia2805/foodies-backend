import Area from './models/Areas.js';
import Category from './models/Category.js';
import Ingredient from './models/Ingredient.js';
import Recipe from './models/Recipe.js';
import RecipeIngredient from './models/RecipeIngredient.js';
import User from './models/User.js';
import UserFavorites from './models/UserFavorites.js';

const initModels = () => {
  Recipe.belongsTo(User, { 
    foreignKey: 'userId', 
    as: 'owner' 
  });

  Recipe.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'categoryOfRecipe',
  });

  Recipe.belongsTo(Area, { 
    foreignKey: 'areaId', 
    as: 'areaOfRecipe' 
  });

  Recipe.belongsToMany(Ingredient, {
    as: 'ingredients',
    through: RecipeIngredient,
  });

  Recipe.hasMany(RecipeIngredient, { 
    foreignKey: 'recipeId', 
    as: 'recipeIngredients' 
  });

  Ingredient.belongsToMany(Recipe, {
    through: RecipeIngredient,
  });
};

export { Ingredient, initModels, Recipe, RecipeIngredient, User };
