import createDebug from "debug";
import chalk from "chalk";
import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../customError/CustomError.js";
import { ValidationError } from "express-validation";

const debug = createDebug("boulderlab-api:server:middlewares:errorMiddlewares");

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  debug(`Error: ${chalk.red(error.message)}`);

  if (error instanceof ValidationError) {
    const validationError = error.details
      .body!.map((joiError) => joiError.message.replaceAll("\\", ""))
      .join(" & ");

    (error as CustomError).publicMessage = validationError;
    debug(chalk.red(validationError));
  }

  const statusCode = error.statusCode || 500;
  const message = error.statusCode ? error.message : "General error";

  res.status(statusCode).json({ message });
};

export const notFoundError = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  const error = new CustomError(404, "Endpoint not found");

  next(error);
};
