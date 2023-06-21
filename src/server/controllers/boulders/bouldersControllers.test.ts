import { type NextFunction, type Request, type Response } from "express";
import {
  addBoulder,
  deleteBoulder,
  getBoulder,
  getBoulders,
  getPaginatedBoulders,
} from "./bouldersControllers.js";
import Boulder from "../../../database/models/Boulders.js";
import CustomError from "../../../customError/CustomError.js";
import { type BoulderDetailsRequest } from "../../types.js";
import { boulderMock } from "../../../mocks/boulderMock.js";

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

describe("Given an addBoulder controller", () => {
  describe("When it receives a new boulder", () => {
    const req: Pick<BoulderDetailsRequest, "body"> = {
      body: {
        boulderDetails: {
          country: "testCountry",
          crag: "testCrag",
          description: "testDescription",
          grade: "testGrade",
          img: "testImg",
          name: "testName",
          spot: "testSpot",
        },
      },
    };

    Boulder.create = jest.fn().mockResolvedValue(req.body.boulderDetails);

    test("Then it should return a 201 status", async () => {
      const expectedStatusCode = 201;

      await addBoulder(req as BoulderDetailsRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should return the expected message", async () => {
      const expectedMessage = "Boulder created";

      await addBoulder(req as BoulderDetailsRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });

  describe("When it receives an undefined boulder", () => {
    test("Then it should return a 400 status", async () => {
      const req: Pick<BoulderDetailsRequest, "body"> = {
        body: {
          boulderDetails: {
            country: "testCountry",
            crag: "testCrag",
            description: "testDescription",
            grade: "testGrade",
            img: "testImg",
            name: "testName",
            spot: "testSpot",
          },
        },
      };

      Boulder.create = jest.fn().mockResolvedValue(undefined);
      const error = new CustomError(400, "Could not create your boulder");

      await addBoulder(req as BoulderDetailsRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getPaginatedBoulders controller", () => {
  describe("When it receives a valid request", () => {
    test("Then it should return a response with status 200", async () => {
      const expectedStatusCode = 200;
      const mockedBoulders = {
        boulders: [
          {
            img: "Kkkk",
            name: "Eclipse",
            crag: "Techos",
            spot: "Albarracin",
            country: "España",
            description: "Sit start",
            grade: "7B",
            id: "6485c7060d1aacb5f35bd4d1",
          },
        ],
      };

      const req: Partial<Request> = {
        query: {
          page: "1",
        },
      };

      Boulder.countDocuments = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(6),
      });

      Boulder.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockedBoulders),
      });

      await getPaginatedBoulders(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it receives an invalid request", () => {
    test("Then it should call the next function", async () => {
      const req = {};

      Boulder.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error()),
      });

      await getPaginatedBoulders(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a getBoulder controller", () => {
  describe("When it receives a valid request with Id '6470ddcd54aeae925d46d8d6'", () => {
    test("Then it should return a response with status 200", async () => {
      const req: CustomRequestWithParams = {
        params: {
          id: boulderMock[0]._id.toString(),
        },
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const bouldersMock = boulderMock[0];

      Boulder.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(bouldersMock),
      });

      await getBoulder(
        req as Request<{ id: string }>,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("Then it should return a boulder with the id '6470ddcd54aeae925d46d8d6'", async () => {
      const req: CustomRequestWithParams = {
        params: {
          id: boulderMock[0]._id.toString(),
        },
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const bouldersMock = boulderMock[0];

      const expectedBoulder = { boulder: bouldersMock };

      Boulder.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(bouldersMock),
      });

      await getBoulder(
        req as Request<{ id: string }>,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedBoulder);
    });
  });

  describe("When it receives a non valid id", () => {
    test("Then it should call the next function with the message 'Boulder not found' error", async () => {
      const req: CustomRequestWithParams = {
        params: {
          id: boulderMock[0]._id.toString(),
        },
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const expectedError = new CustomError(404, "Boulder not found");

      Boulder.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await getBoulder(req as Request<{ id: string }>, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
