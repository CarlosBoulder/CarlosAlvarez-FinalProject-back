import { type NextFunction, type Request, type Response } from "express";
import Boulder from "../../../database/models/Boulders.js";
import CustomError from "../../../customError/CustomError.js";

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

export const deleteBoulder = async (
  req: Request<{ boulderId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { boulderId } = req.params;

  try {
    const boulder = await Boulder.findByIdAndDelete(boulderId).exec();

    if (!boulder) {
      const error = new CustomError(404, "Boulder not found");

      throw error;
    }

    res.status(200).json({ message: `Boulder deleted` });
  } catch (error: unknown) {
    next(error);
  }
};
