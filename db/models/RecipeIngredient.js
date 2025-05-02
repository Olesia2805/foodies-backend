import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';

const RecipeIngredient = sequelize.define('RecipeIngredient', {
  measure: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default RecipeIngredient;
