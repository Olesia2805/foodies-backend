import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";

const Category = sequelize.define(
  "category",
  {
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
