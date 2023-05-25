import { type Response, type Request, type NextFunction } from "express";
import { generalError } from "../errorMiddlewares.js";
import CustomError from "../../../customError/CustomError.js";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a general Error middleware", () => {
  const req = {};

  const res: Pick<Response, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();
  describe("When it receives a 404 'Endpoint not found' error and a response", () => {
    const statusCode = 404;

    const json = "Endpoint not found";

    const error = new CustomError(statusCode, "Endpoint not found");

    const expectedErrorMessage = {
      message: json,
    };

    test("Then it should call the response's method status with 404", () => {
      generalError(
        error,
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(error.statusCode);
    });

    test("Then it should call the response's json with a 'Endpoint not found' message", () => {
      generalError(
        error,
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedErrorMessage);
    });
  });

  describe("When it receives an error without status code and a response", () => {
    const json = "General error";

    const error = new Error(json);
    test("Then it should call the response's method status with 500", () => {
      const statusCode = 500;
      generalError(
        error as CustomError,
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call the response's method json with a message 'General error'", () => {
      const expectedErrorMessage = {
        message: json,
      };

      generalError(
        error as CustomError,
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedErrorMessage);
    });
  });
});
