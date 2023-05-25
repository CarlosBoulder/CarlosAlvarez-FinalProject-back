import cors from "cors";
import express from "express";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS!;

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

export default app;
