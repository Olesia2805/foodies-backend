import Area from './models/Areas.js';
import Category from './models/Category.js';
import Ingredient from './models/Ingredient.js';
import Recipe from './models/recipe.js';
import RecipeIngredient from './models/RecipeIngredient.js';
import User from './models/User.js';
import UserFavorites from './models/UserFavorites.js';

const initModels = () => {
  Recipe.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
  User.hasMany(Recipe, { foreignKey: 'userId', as: 'recipes' });

  Recipe.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'categoryOfRecipe',
  });
  Category.hasMany(Recipe, { foreignKey: 'categoryId', as: 'recipes' });

  Recipe.belongsTo(Area, { foreignKey: 'areaId', as: 'areaOfRecipe' });
  Area.hasMany(Recipe, { foreignKey: 'areaId', as: 'recipes' });

  Recipe.belongsToMany(Ingredient, {
    as: 'recipeIngredients',
    through: RecipeIngredient,
  });

  Ingredient.belongsToMany(Recipe, {
    through: RecipeIngredient,
  });

  User.belongsToMany(Recipe, {
  through: UserFavorites,
  foreignKey: 'user_id',
  otherKey: 'recipe_id',
  as: 'favoriteRecipes'
});

// Recipe associations
Recipe.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

Recipe.belongsToMany(User, {
  through: UserFavorites,
  foreignKey: 'recipe_id',
  otherKey: 'user_id',
  as: 'favoritedBy'
});

// UserFavorites associations
UserFavorites.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

UserFavorites.belongsTo(Recipe, {
  foreignKey: 'recipe_id',
  as: 'recipe'
}); 
};

export { Ingredient, initModels, Recipe, RecipeIngredient, User };
