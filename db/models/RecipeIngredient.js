import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';

const RecipeIngredient = sequelize.define(
  'recipeIngredient',
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
