import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";

const Ingredient = sequelize.define(
    "Ingredient",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    }
);

export default Ingredient;
