import express from "express";

import categoryController from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

categoryRouter.get("/", categoryController.getAllCategories);

export default categoryRouter;

