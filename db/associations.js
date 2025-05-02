import { sequelize } from './Sequelize.js';
import User from './models/User.js';
import Recipe from './models/Recipe.js';
import Category from './models/Category.js';
import Area from './models/Area.js';
import Ingredient from './models/Ingredient.js';
import RecipeIngredient from './models/RecipeIngredient.js';

const setupAssociations = () => {
  // User associations
  User.hasMany(Recipe, { foreignKey: 'owner_id', as: 'recipes' });
  User.belongsToMany(User, {
    as: 'followers',
    through: 'UserFollowers',
    foreignKey: 'followingId',
    otherKey: 'followerId',
  });
  User.belongsToMany(User, {
    as: 'following',
    through: 'UserFollowers',
    foreignKey: 'followerId',
    otherKey: 'followingId',
  });

  // Recipe associations
  Recipe.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
  Recipe.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
  Recipe.belongsTo(Area, { foreignKey: 'area_id', as: 'area' });
  Recipe.belongsToMany(Ingredient, {
    through: RecipeIngredient,
    foreignKey: 'recipe_id',
    otherKey: 'ingredient_id',
    as: 'ingredients'
  });

  // Category associations
  Category.hasMany(Recipe, { foreignKey: 'category_id', as: 'recipes' });

  // Area associations
  Area.hasMany(Recipe, { foreignKey: 'area_id', as: 'recipes' });

  // Ingredient associations
  Ingredient.belongsToMany(Recipe, {
    through: RecipeIngredient,
    foreignKey: 'ingredient_id',
    otherKey: 'recipe_id',
    as: 'recipes'
  });
};

export default setupAssociations; 