import express from "express";
import { uploadCategoryImage } from '../middlewares/upload.js';

import categoryController from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

categoryRouter.get("/", categoryController.getAllCategories);

categoryRouter.post(
  '/',
  auth,
  uploadCategoryImage.single('image'),
  validateBody(createCategorySchema),
  categoryController.createCategory
);

export default categoryRouter;

