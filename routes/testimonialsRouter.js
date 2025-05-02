import express from 'express';
import testimonialsController from '../controllers/testimonialsController.js';
import validateQuery from '../helpers/validateQuery.js';
import { paginationSchema } from '../schemas/paginationSchema.js';

const testimonialsRouter = express.Router();

testimonialsRouter.get(
  '/',
  validateQuery(paginationSchema),
  testimonialsController.getTestimonialsCtrl
);

export default testimonialsRouter;
