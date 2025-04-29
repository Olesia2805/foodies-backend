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
        imageURL: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
);

// Ingredient.sync({force: true});

export default Ingredient;
