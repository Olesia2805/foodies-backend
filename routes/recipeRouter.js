import express from 'express';

import recipeController from '../controllers/recipeControllers.js';
import validateBody from '../helpers/validateBody.js';
import { createRecipeSchema } from '../schemas/recipeSchema.js';

import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const recipeRouter = express.Router();

recipeRouter.post(
  '/',
  auth,
  upload.single('image'),
  upload.moveRecipeImageToPublic,
  validateBody(createRecipeSchema),
  recipeController.createRecipe
);

recipeRouter.delete('/:id', auth, recipeController.deleteRecipe);

recipeRouter.get('/own', auth, recipeController.getUserRecipes);

export default recipeRouter;
