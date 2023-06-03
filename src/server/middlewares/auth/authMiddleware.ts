import jwt from "jsonwebtoken";
import { type NextFunction, type Response } from "express";
import { type AuthRequest } from "../../types.js";
import CustomError from "../../../customError/CustomError.js";

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader?.includes("Bearer")) {
      const error = new CustomError(401, "Missing token");

      throw error;
    }

    const token = authorizationHeader.replace("Bearer ", "");

    const { sub } = jwt.verify(token, process.env.JWT_SECRET!);

    req.userId = sub as string;

    next();
  } catch (error: unknown) {
    const customError =
      (error as Error).name === "JsonWebTokenError"
        ? new CustomError(401, "Invalid token")
        : error;

    next(customError);
  }
};
