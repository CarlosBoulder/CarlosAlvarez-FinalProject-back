import { type NextFunction, type Request, type Response } from "express";
import boulderMock from "../../../mocks/boulderMock.js";
import { getBoulders } from "./bouldersControllers.js";
import Boulder from "../../../database/models/Boulders.js";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a getBoulders controller", () => {
  const req = {};
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  describe("When it receives a valid request", () => {
    test("Then it should return a response with status 200", async () => {
      Boulder.find = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(boulderMock) });

      const expectedStatusCode = 200;

      await getBoulders(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should return a response with a list of boulders in the body", async () => {
      Boulder.find = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(boulderMock) });

      const expectedResponseBody = {
        boulders: boulderMock,
      };

      await getBoulders(req as Request, res as Response, next as NextFunction);

      expect(res.json).toHaveBeenCalledWith(expectedResponseBody);
    });
  });

  describe("When it receives an invalid request", () => {
    test("Then it should call the next function", async () => {
      const error = new Error();

      Boulder.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(error),
      });

      await getBoulders(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});
