import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { auth } from "./authMiddleware";
import { type AuthRequest } from "../../types";
import CustomError from "../../../customError/CustomError";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given an auth middleware", () => {
  const token = "token.for.test";
  const req: Pick<Request, "header"> = {
    header: jest.fn().mockReturnValue(`Bearer ${token}`),
  };
  const res = {};
  const next = jest.fn();

  describe("When it receives an authorization header with a valid token and a next function", () => {
    test("Then it should call the received next function", () => {
      jwt.verify = jest.fn();

      auth(req as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives an authorization header with an invalid token and a next function", () => {
    test("Then it should call the received next function with a 401 'Invalid token' error", () => {
      const expectedError = new CustomError(401, "Invalid token");
      jwt.verify = jest.fn().mockImplementation(() => {
        throw expectedError;
      });

      auth(req as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives an authorization header without bearer and a next function", () => {
    test("Then it should call the received next function with a 401 'Missing token' error", () => {
      const req: Pick<Request, "header"> = {
        header: jest.fn().mockReturnValue(token),
      };
      const expectedError = new CustomError(401, "Missing token");

      auth(req as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
