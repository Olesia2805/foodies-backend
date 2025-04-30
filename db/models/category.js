import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";

const Category = sequelize.define("category", {
  _id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// Category.sync();

export default Category;
