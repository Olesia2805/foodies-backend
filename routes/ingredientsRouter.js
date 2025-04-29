import express from "express";
import validateBody from "../helpers/validateBody.js";
import ingredientController from "../controllers/ingredientController.js";
import validateQuery from "../helpers/validateQuery.js";
import { ingredientsGetAll, ingredientsGetList } from "../schemas/ingredientsShema.js";

const ingredientsRouter = express.Router();

ingredientsRouter.get("/", validateQuery(ingredientsGetAll), ingredientController.getIngredients);
ingredientsRouter.get("/list", validateQuery(ingredientsGetList), ingredientController.getIngredienList);
ingredientsRouter.get("/:id", ingredientController.getIngredientByID);

export default ingredientsRouter;
