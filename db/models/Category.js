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
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL of the category image stored in Cloudinary',
    },
  },
  {
    timestamps: false,
  }
);

// Category.sync();

export default Category;
