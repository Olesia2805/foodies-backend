import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";
import User from "./User.js";
import Area from "./area.js";
import Category from "./category.js";

const Recipe = sequelize.define(
  "recipe",
  {
    _id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "_id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Визначаємо зв'язок між моделями
Recipe.belongsTo(User, { foreignKey: "userId", as: "owner" });
User.hasMany(Recipe, { foreignKey: "userId", as: "recipes" });

// Синхронізуємо модель з базою даних
Recipe.sync();

export default Recipe;
