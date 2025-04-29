import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";

const Category = sequelize.define(
  "category",
  {
    _id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Синхронізуємо модель з базою даних
Category.sync();

export default Category;
