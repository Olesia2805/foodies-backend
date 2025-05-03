import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';

const Category = sequelize.define(
  'category',
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
  },
  {
    timestamps: false,
  }
);

// Category.sync();

export default Category;
