import express from "express";
import { getTestimonialsCtrl } from "../controllers/testimonialsController.js";

const testimonialsRouter = express.Router();

// Публічний ендпоінт для отримання списку відгуків
testimonialsRouter.get("/", getTestimonialsCtrl);

export default testimonialsRouter;
