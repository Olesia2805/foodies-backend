import express from "express";

import recipeController from "../controllers/recipeControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createRecipeSchema } from "../schemas/recipeSchema.js";

import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const recipeRouter = express.Router();

// Private endpoint to get user's own recipes (requires authentication)
recipeRouter.get("/own", auth, recipeController.getUserRecipes);

// Private endpoint for creating a recipe (requires authentication)
recipeRouter.post(
  "/",
  auth,
  upload.single("image"),
  // upload.moveRecipeImageToPublic,
  validateBody(createRecipeSchema),
  recipeController.createRecipe
);

recipeRouter.get("/:recipeId", recipeController.getRecipeById);

export default recipeRouter;
