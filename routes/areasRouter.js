import express from 'express';
import areasControllers from '../controllers/areasControllers.js';
import validateQuery from '../helpers/validateQuery.js';
import { areasGetByName } from '../schemas/areasSchema.js';

const areasRouter = express.Router();

/**
 * @swagger
 * /api/areas:
 *   get:
 *     summary: Retrieve a list of areas
 *     description: Retrieve a list of culinary areas from the database.
 *     tags:
 *       - Areas
 *     responses:
 *       200:
 *         description: A list of areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: object
 *                     properties:
 *                       $oid:
 *                         type: string
 *                         description: The area ID
 *                         example: 6462a6f04c3d0ddd28897f9b
 *                   name:
 *                     type: string
 *                     description: The name of the area
 *                     example: Ukrainian
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Forbidden"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
areasRouter.get(
  '/', 
  areasControllers.getAreas
);

/**
 * @swagger
 * /api/areas/search:
 *   get:
 *     summary: Retrieve a list of areas by name
 *     description: Retrieve a list of culinary areas from the database by name.
 *     tags:
 *       - Areas
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         description: The name of the area to search for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of areas matching the name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: object
 *                     properties:
 *                       $oid:
 *                         type: string
 *                         description: The area ID
 *                         example: 6462a6f04c3d0ddd28897f9b
 *                   name:
 *                     type: string
 *                     description: The name of the area
 *                     example: Ukrainian
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Bad request"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Forbidden"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
*/
areasRouter.get(
  '/search',
  validateQuery(areasGetByName),
  areasControllers.getAreasByName
);

export default areasRouter;
