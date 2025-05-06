import express from 'express';
import ingredientController from '../controllers/ingredientsController.js';
import validateQuery from '../helpers/validateQuery.js';
import { ingredientsGetList } from '../schemas/ingredientsSchema.js';
import { paginationSchema } from '../schemas/paginationSchema.js';

const ingredientsRouter = express.Router();

/**
 * @swagger
 * /api/ingredients:
 *   get:
 *     summary: Get paginated list of ingredients
 *     description: Retrieve a paginated list of ingredients from the database.
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: A paginated list of ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ingredient ID
 *                         example: 6462a6f04c3d0ddd28897f9b
 *                       name:
 *                         type: string
 *                         description: The name of the ingredient
 *                         example: Sugar
 *                 total:
 *                   type: integer
 *                   description: Total number of ingredients
 *                   example: 100
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */

ingredientsRouter.get(
  '/',
  validateQuery(paginationSchema),
  ingredientController.getIngredients
);

/**
 * @swagger
 * /api/ingredients/list:
 *   get:
 *     summary: Get a list of ingredients
 *     description: Retrieve a list of ingredients based on specific filters.
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter criteria for ingredients
 *     responses:
 *       200:
 *         description: A list of ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ingredient ID
 *                     example: 6462a6f04c3d0ddd28897f9b
 *                   name:
 *                     type: string
 *                     description: The name of the ingredient
 *                     example: Sugar
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */

ingredientsRouter.get(
  '/list',
  validateQuery(ingredientsGetList),
  ingredientController.getIngredienList
);

/**
 * @swagger
 * /api/ingredients/{id}:
 *   get:
 *     summary: Get ingredient by ID
 *     description: Retrieve a specific ingredient by its ID.
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ingredient
 *     responses:
 *       200:
 *         description: Ingredient retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ingredient ID
 *                   example: 6462a6f04c3d0ddd28897f9b
 *                 name:
 *                   type: string
 *                   description: The name of the ingredient
 *                   example: Sugar
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Internal server error
 */

ingredientsRouter.get(
  '/:id', 
  ingredientController.getIngredientByID
);

export default ingredientsRouter;
