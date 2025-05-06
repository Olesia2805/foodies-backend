import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';

const RecipeIngredient = sequelize.define(
  'recipe_ingredient',
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
