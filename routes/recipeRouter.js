import express from 'express';

import recipeController from '../controllers/recipeControllers.js';
import validateBody from '../helpers/validateBody.js';
import { addToFavorites, createRecipeSchema } from '../schemas/recipeSchema.js';

import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import { paginationSchema } from '../schemas/paginationSchema.js';
import validateQuery from '../helpers/validateQuery.js';

const recipeRouter = express.Router();

recipeRouter.post(
  '/',
  auth,
  upload.single('image'),
  upload.moveRecipeImageToPublic,
  validateBody(createRecipeSchema),
  recipeController.createRecipe
);


recipeRouter.post(
  '/favorites',
  auth,
  validateBody(addToFavorites),
  recipeController.addToFavorites
);

recipeRouter.delete(
  '/favorites',
  auth,
  validateBody(addToFavorites),
  recipeController.deleteFromFavorites
);

recipeRouter.get(
  '/favorites',
  auth,
  validateQuery(paginationSchema),
  recipeController.getFavorites
);

recipeRouter.delete('/:id', auth, recipeController.deleteRecipe);

//TODO WHAT AMONG THESE TWO WE SHOULD LEFT?
recipeRouter.delete('/:recipeId', auth, recipeController.deleteRecipe);


recipeRouter.get('/own', auth, recipeController.getUserRecipes);

recipeRouter.get('/:recipeId', recipeController.getRecipeById);

export default recipeRouter;
