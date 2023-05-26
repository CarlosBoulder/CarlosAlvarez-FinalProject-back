import { type NextFunction, type Request, type Response } from "express";
import Boulder from "../../../database/models/Boulders";

export const getBoulders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const boulders = await Boulder.find().exec();

    res.status(200).json({ boulders });
  } catch (error: unknown) {
    next(error);
  }
};
