import express from "express";
import ingredientController from "../controllers/ingredientsController.js";
import validateQuery from "../helpers/validateQuery.js";
import { ingredientsGetAll, ingredientsGetList } from "../schemas/ingredientsSchema.js";

const ingredientsRouter = express.Router();

ingredientsRouter.get("/", validateQuery(ingredientsGetAll), ingredientController.getIngredients);
ingredientsRouter.get("/list", validateQuery(ingredientsGetList), ingredientController.getIngredienList);
ingredientsRouter.get("/:id", ingredientController.getIngredientByID);

export default ingredientsRouter;
