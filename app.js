import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import authRouter from "./routes/authRouter.js";
import testimonialsRouter from "./routes/testimonialsRouter.js";

import ingredientsRouter from './routes/ingredientsRouter.js';
import recipeRouter from './routes/recipeRouter.js';
import categoryRouter from './routes/categoryRouter.js';


import usersRouter from './routes/usersRouter.js';
import areasRouter from './routes/areasRouter.js';

import { initModels } from "./db/initModels.js";
initModels();

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Initialize Sequelize models and associations
initModels();

app.use("/api/auth", authRouter);
app.use("/api/testimonials", testimonialsRouter);

app.use('/api/auth', authRouter);

app.use('/api/ingredients', ingredientsRouter);
app.use('/api/recipes', recipeRouter);
app.use('/api/categories', categoryRouter);

app.use('/api/users', usersRouter);
app.use('/api/areas', areasRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ status, message });
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
