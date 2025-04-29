import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";

const Ingredient = sequelize.define(
  "ingredient",
  {
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
    timestamps: true,
  }
);

// Синхронізуємо модель з базою даних
Ingredient.sync();

export default Ingredient;
