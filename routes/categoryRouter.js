import express from "express";
import { uploadCategoryImage } from '../middlewares/upload.js';
import auth from '../middlewares/auth.js';
import validateBody from '../helpers/validateBody.js';
import { createCategorySchema } from '../schemas/categorySchema.js';

import categoryController from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     description: Add a new category to the database.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *                 example: Desserts
 *               description:
 *                 type: string
 *                 description: The description of the category
 *                 example: Sweet dishes and desserts.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the category
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
categoryRouter.post(
  '/',
  auth,
  uploadCategoryImage.single('image'),
  validateBody(createCategorySchema),
  categoryController.createCategory
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The category ID
 *                     example: 6462a6f04c3d0ddd28897f9b
 *                   name:
 *                     type: string
 *                     description: The name of the category
 *                     example: Desserts
 *                   description:
 *                     type: string
 *                     description: The description of the category
 *                     example: Sweet dishes and desserts.
 *       500:
 *         description: Internal server error
 */
categoryRouter.get("/", categoryController.getAllCategories);

export default categoryRouter;

