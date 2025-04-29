import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";
import User from "./User.js";
import Category from "./Category.js";

const Recipe = sequelize.define(
    "recipe",
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        imageURL: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        cookingTime: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Category,
                key: 'id'
            }
        }
    },
);

// Define associations
Recipe.belongsTo(User, { foreignKey: 'userId' });
Recipe.belongsTo(Category, { foreignKey: 'categoryId' });

Recipe.sync();

export default Recipe;
