import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';
import Recipe from './Recipe.js';
import Ingredient from './Ingredient.js';

const RecipeIngredient = sequelize.define(
  'RecipeIngredient',
  {
    measure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);


export default RecipeIngredient;
