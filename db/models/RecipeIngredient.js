import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";
import Recipe from "./Recipe.js";
import Ingredient from "./Ingredient.js";

const RecipeIngredient = sequelize.define("recipe_ingredient", {
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recipe,
      key: "id",
    },
  },
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Ingredient,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define associations for many-to-many relationship
Recipe.belongsToMany(Ingredient, { through: RecipeIngredient });
Ingredient.belongsToMany(Recipe, { through: RecipeIngredient });

// RecipeIngredient.sync({force: true});

export default RecipeIngredient;
