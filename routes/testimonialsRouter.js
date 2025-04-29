import express from "express";
import { getTestimonials } from "../controllers/testimonialsController.js";

const testimonialsRouter = express.Router();

// Публічний ендпоінт для отримання списку відгуків
testimonialsRouter.get("/", getTestimonials);

export default testimonialsRouter;
