import { type NextFunction, type Request, type Response } from "express";
import boulderMock from "../../../mocks/boulderMock.js";
import { deleteBoulder, getBoulders } from "./bouldersControllers.js";
import Boulder from "../../../database/models/Boulders.js";
import CustomError from "../../../customError/CustomError.js";

interface CustomRequest extends Request {
  userId: string;
}

type CustomRequestWithParams = Pick<CustomRequest, "params">;

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn();

describe("Given a getBoulders controller", () => {
  const req = {};
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

describe("Given a deleteBoulder controller", () => {
  const req: CustomRequestWithParams = {
    params: {
      id: boulderMock[0]._id.toString(),
    },
  };
  describe("When it receives a response and the boulder exists", () => {
    const bouldersMock = boulderMock[0];

    Boulder.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(bouldersMock),
    });

    test("Then it should return a response with status 200", async () => {
      await deleteBoulder(
        req as Request<{ boulderId: string }>,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("Then it should call the response's method json with the message 'Boulder deleted'", async () => {
      const expectedMessage = "Boulder deleted";

      await deleteBoulder(
        req as Request<{ boulderId: string }>,
        res as Response,
        next
      );

      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });

  describe("When it receives a next function and the boulder doesn't exist", () => {
    test("Then it should call next with a 'Boulder not found' error", async () => {
      Boulder.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const expectedError = new CustomError(404, "Boulder not found");

      await deleteBoulder(
        req as Request<{ boulderId: string }>,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
