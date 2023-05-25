import { type Response, type Request, type NextFunction } from "express";
import { notFoundError } from "../errorMiddlewares";
import CustomError from "../../../customError/CustomError";

describe("Given a notFoundError middleware", () => {
  describe("When it receives a request and a next function", () => {
    test("Then it should call the next function with an error 404 'Endpoint not found'", () => {
      const expectedError = new CustomError(404, "Endpoint not found");

      const req = {};

      const res: Pick<Response, "status" | "json"> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      notFoundError(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
