import cors from "cors";
import express from "express";
import morgan from "morgan";
import {
  generalError,
  notFoundError,
} from "./middlewares/error/errorMiddlewares.js";
import { pingController } from "./controllers/ping/pingController.js";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS!;

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.get("/", pingController);

app.use(notFoundError);

app.use(generalError);

export default app;
