import express from 'express';

import recipeController from '../controllers/recipeControllers.js';
import validateBody from '../helpers/validateBody.js';
import { createRecipeSchema } from '../schemas/recipeSchema.js';

import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const recipeRouter = express.Router();

recipeRouter.get('/', recipeController.getRecipes);

recipeRouter.post(
  '/',
  auth,
  upload.single('image'),
  upload.moveRecipeImageToPublic,
  validateBody(createRecipeSchema),
  recipeController.createRecipe
);

recipeRouter.delete('/:recipeId', auth, recipeController.deleteRecipe);

recipeRouter.get('/own', auth, recipeController.getUserRecipes);

recipeRouter.get('/:recipeId', recipeController.getRecipeById);

export default recipeRouter;
