import "../../loadEnvironment.js";
import createDebug from "debug";
import chalk from "chalk";
import { type NextFunction, type Request, type Response } from "express";
import type CustomError from "../../customError/CustomError.js";

const debug = createDebug("boulderlab-api:server:middlewares:errorMiddlewares");

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  debug(`Error: ${chalk.red(error.message)}`);

  const statusCode = error.statusCode || 500;
  const message = error.statusCode ? error.message : "General error";

  res.status(statusCode).json({ message });
};
