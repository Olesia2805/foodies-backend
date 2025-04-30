import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import authRouter from "./routes/authRouter.js";

import recipeRouter from "./routes/recipeRouter.js";

import usersRouter from "./routes/usersRouter.js";


const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);

app.use("/api/recipes", recipeRouter);

app.use("/api/users", usersRouter);


app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ status, message });
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
