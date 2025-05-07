import express from 'express';
import testimonialsController from '../controllers/testimonialsController.js';
import validateQuery from '../helpers/validateQuery.js';
import { paginationSchema } from '../schemas/paginationSchema.js';

const testimonialsRouter = express.Router();

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get paginated list of testimonials
 *     description: Retrieve a paginated list of testimonials from the database.
 *     tags:
 *       - Testimonials
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
 *         description: A paginated list of testimonials
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
 *                         description: The testimonial ID
 *                         example: 6462a6f04c3d0ddd28897f9b
 *                       message:
 *                         type: string
 *                         description: The testimonial message
 *                         example: "Great service!"
 *                 total:
 *                   type: integer
 *                   description: Total number of testimonials
 *                   example: 100
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */

testimonialsRouter.get(
  '/',
  validateQuery(paginationSchema),
  testimonialsController.getTestimonialsCtrl
);

export default testimonialsRouter;
