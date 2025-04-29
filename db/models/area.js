import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";

const Area = sequelize.define(
  "area",
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
Area.sync();

export default Area;
