import { type NextFunction, type Request, type Response } from "express";
import Boulder from "../../../database/models/Boulders.js";
import CustomError from "../../../customError/CustomError.js";
import { Types } from "mongoose";
import { type BoulderDetailsRequest } from "../../types.js";

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

export const getPaginatedBoulders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5;
    const startIndex = (Number(page) - 1) * Number(limit);

    const totalBoulders = await Boulder.countDocuments().exec();

    const boulders = await Boulder.find()
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(Number(limit))
      .exec();

    const paginationResponse = {
      totalBoulders,
      totalPages: Math.ceil(totalBoulders / Number(limit)),
      currentPage: Number(page),
      boulders,
    };

    res.status(200).json(paginationResponse);
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

export const addBoulder = async (
  req: BoulderDetailsRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { boulderDetails: body } = req.body;

    const newboulder = await Boulder.create({
      ...body,
      boulder: new Types.ObjectId(),
    });

    if (!newboulder) {
      const error = new CustomError(400, "Could not create your boulder");

      throw error;
    }

    res.status(201).json({ message: `Boulder created` });
  } catch (error: unknown) {
    next(error);
  }
};
