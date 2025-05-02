import User from './models/User.js';
import Recipe from './models/Recipe.js';
import UserFavorites from './models/UserFavorites.js';

// User associations
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