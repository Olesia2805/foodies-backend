import express from 'express';

import recipeController from '../controllers/recipeControllers.js';
import validateBody from '../helpers/validateBody.js';
import { addToFavorites, createRecipeSchema } from '../schemas/recipeSchema.js';

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

recipeRouter.get('/own', auth, recipeController.getUserRecipes);

recipeRouter.post(
  '/favorites',
  auth,
  validateBody(addToFavorites),
  recipeController.addToFavorites
);

export default recipeRouter;
