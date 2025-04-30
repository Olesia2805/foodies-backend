import express from 'express';
import testimonialsController from '../controllers/testimonialsController.js';

const testimonialsRouter = express.Router();

// Публічний ендпоінт для отримання списку відгуків
testimonialsRouter.get('/', testimonialsController.getTestimonialsCtrl);

export default testimonialsRouter;
