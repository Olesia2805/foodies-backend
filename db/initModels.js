import Area from './models/Areas.js';
import Category from './models/Category.js';
import Ingredient from './models/Ingredient.js';
import Recipe from './models/Recipe.js';
import RecipeIngredient from './models/RecipeIngredient.js';
import User from './models/User.js';

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

  Ingredient.hasMany(RecipeIngredient, { 
    foreignKey: 'ingredientId', 
    as: 'ingredientRecipes' 
  });

  RecipeIngredient.belongsTo(Recipe, { 
    foreignKey: 'recipeId', 
    as: 'recipeIngredients' 
  });

  RecipeIngredient.belongsTo(Ingredient, { 
    foreignKey: 'ingredientId', 
    as: 'ingredients' 
  });

  User.hasMany(Recipe, { 
    foreignKey: 'userId', 
    as: 'recipes' 
  });

  Category.hasMany(Recipe, { 
    foreignKey: 'categoryId', 
    as: 'recipes' 
  });

  Area.hasMany(Recipe, { 
    foreignKey: 'areaId', 
    as: 'recipes' 
  });

};

export { initModels, Ingredient, Recipe, RecipeIngredient, User };
