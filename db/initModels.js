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
    as: 'owner',
  });

  Recipe.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'categoryOfRecipe',
  });

  Recipe.belongsTo(Area, {
    foreignKey: 'areaId',
    as: 'areaOfRecipe',
  });

  Recipe.belongsToMany(Ingredient, {
    as: 'ingredients',
    through: RecipeIngredient,
  });

  Recipe.hasMany(RecipeIngredient, {
    foreignKey: 'recipeId',
    as: 'RecipeIngredients',
  });

  Recipe.belongsToMany(User, {
    through: UserFavorites,
    foreignKey: 'recipe_id',
    otherKey: 'user_id',
    as: 'favoritedBy',
  });

  Ingredient.belongsToMany(Recipe, {
    through: RecipeIngredient,
  });

  Ingredient.hasMany(RecipeIngredient, {
    foreignKey: 'ingredientId',
    as: 'ingredientRecipes',
  });

  RecipeIngredient.belongsTo(Recipe, {
    foreignKey: 'recipeId',
    as: 'RecipeIngredients',
  });

  RecipeIngredient.belongsTo(Ingredient, {
    foreignKey: 'ingredientId',
    as: 'ingredient',
  });

  User.hasMany(Recipe, {
    foreignKey: 'userId',
    as: 'recipes',
  });

  User.belongsToMany(Recipe, {
    through: UserFavorites,
    foreignKey: 'user_id',
    otherKey: 'recipe_id',
    as: 'favoriteRecipes',
  });

  Category.hasMany(Recipe, {
    foreignKey: 'categoryId',
    as: 'recipes',
  });

  Area.hasMany(Recipe, {
    foreignKey: 'areaId',
    as: 'recipes',
  });

  UserFavorites.belongsTo(Recipe, {
    foreignKey: 'recipe_id',
    as: 'recipe',
  });

  UserFavorites.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });
};

export { Category, Ingredient, initModels, Recipe, RecipeIngredient, User };
