import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';
import Area from './Areas.js';
import Category from './Category.js';
import User from './User.js';
import RecipeIngredient from './RecipeIngredient.js';
import Ingredient from './Ingredient.js';

const Recipe = sequelize.define(
  'recipe',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // category: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: '_id',
      },
    },
    // area: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    areaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Area,
        key: '_id',
      },
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: '_id',
      },
    },
  },
  {
    timestamps: true,
  }
);

Recipe.belongsToMany(Ingredient, {
  through: RecipeIngredient,
  foreignKey: 'recipeId',
  otherKey: 'ingredientId',
  as: 'ingredients'
});

Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient,
  foreignKey: 'ingredientId',
  otherKey: 'recipeId',
  as: 'recipes'
});

User.hasMany(Recipe, {
  foreignKey: 'userId',
  as: 'recipes',
});

Recipe.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner',
});

Recipe.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});
Category.hasMany(Recipe);

Recipe.belongsTo(Area, {
  foreignKey: 'areaId',
  as: 'area',
});
Area.hasMany(Recipe, {
  foreignKey: 'areaId',
  as: 'recipes',
});

// Recipe.sync();

export default Recipe;
