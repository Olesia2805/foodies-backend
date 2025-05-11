import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';

const Ingredient = sequelize.define(
  'ingredient',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    autoIncrement: false,
    timestamps: true,
  }
);

// Ingredient.sync();

export default Ingredient;
