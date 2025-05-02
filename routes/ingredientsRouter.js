import express from 'express';
import ingredientController from '../controllers/ingredientsController.js';
import validateQuery from '../helpers/validateQuery.js';
import { ingredientsGetList } from '../schemas/ingredientsSchema.js';
import { paginationSchema } from '../schemas/paginationSchema.js';

const ingredientsRouter = express.Router();

ingredientsRouter.get(
  '/',
  validateQuery(paginationSchema),
  ingredientController.getIngredients
);
ingredientsRouter.get(
  '/list',
  validateQuery(ingredientsGetList),
  ingredientController.getIngredienList
);
ingredientsRouter.get('/:id', ingredientController.getIngredientByID);

export default ingredientsRouter;
