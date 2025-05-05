import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRouter from './routes/authRouter.js';
import testimonialsRouter from './routes/testimonialsRouter.js';

import ingredientsRouter from './routes/ingredientsRouter.js';
import recipeRouter from './routes/recipeRouter.js';
import categoryRouter from './routes/categoryRouter.js';

import usersRouter from './routes/usersRouter.js';
import areasRouter from './routes/areasRouter.js';

import { initModels } from './db/initModels.js';
initModels();

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Foodies API',
      version: '1.0.0',
      description: 'API documentation for the Foodies application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', authRouter);
app.use('/api/testimonials', testimonialsRouter);

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
