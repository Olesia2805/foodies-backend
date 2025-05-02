import Ingredient from './models/Ingredient_.js';
import Recipe from './models/recipe.js';
import RecipeIngredient from './models/RecipeIngredient.js';
import User from './models/User.js';

const initModels = () => {
  Recipe.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
  User.hasMany(Recipe, { foreignKey: 'userId', as: 'recipes' });

  Recipe.belongsToMany(Ingredient, {
    as: 'recipeIngredients',
    through: RecipeIngredient,
  });

  Ingredient.belongsToMany(Recipe, {
    through: RecipeIngredient,
  });
};

export { Ingredient, initModels, Recipe, RecipeIngredient, User };
