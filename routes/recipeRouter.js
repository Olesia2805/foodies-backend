import express from "express";

import recipeController from "../controllers/recipeControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createRecipeSchema } from "../schemas/recipeSchema.js";

import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const recipeRouter = express.Router();

// Private endpoint for creating a recipe (requires authentication)
recipeRouter.post(
    "/",
    auth,
    upload.single("image"),
    upload.moveRecipeImageToPublic,
    validateBody(createRecipeSchema),
    recipeController.createRecipe
);

// Private endpoint to get user's own recipes (requires authentication)
recipeRouter.get("/own", auth, recipeController.getUserRecipes);

// Endpoints to get categories and ingredients for recipe creation form
recipeRouter.get("/categories", recipeController.getCategories);
recipeRouter.get("/ingredients", recipeController.getIngredients);

export default recipeRouter;
