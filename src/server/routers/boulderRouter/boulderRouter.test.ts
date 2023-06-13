import "../../../loadEnvironment.js";
import request from "supertest";
import app from "../../app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToDatabase from "../../../database/connectToDatabase";
import mongoose from "mongoose";
import Boulder from "../../../database/models/Boulders.js";
import { tokenMock } from "../../../mocks/tokenMock.js";
import { boulderMock, createboulderMock } from "../../../mocks/boulderMock.js";

let server: MongoMemoryServer;
const path = "/boulders/all";

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await Boulder.deleteMany();
});

beforeEach(() => {
  jest.clearAllMocks();
});

beforeEach(async () => {
  await Boulder.create(boulderMock);
});

describe("Given a GET 'boulders/all' endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a response with status 200 and a list of boulders", async () => {
      const expectedStatus = 200;

      const response = await request(app)
        .get(path)
        .set("Authorization", `Bearer ${tokenMock}`)
        .expect(expectedStatus);

      expect(response.body.boulders).toHaveLength(1);
    });
  });

  describe("When it recieves a request with invalid token", () => {
    test("Then it should return statusCode 401 ", async () => {
      const expectedStatus = 401;

      await request(app).get(path).expect(expectedStatus);
    });
  });
});

describe("Given a Delete 'boulders/:boulderId' endpoint", () => {
  describe("When it receives a request with boulder id", () => {
    test("Then it should return a response with status 200 and message 'Boulder deleted", async () => {
      const expectedStatusCode = 200;
      const expectedMessage = "Boulder deleted";

      const response = await request(app)
        .delete(`/boulders/${boulderMock[0]._id.toString()}`)
        .set("Authorization", `Bearer ${tokenMock}`)
        .expect(expectedStatusCode);

      expect(response.body.message).toBe(expectedMessage);
    });
  });
});

describe("Given a Post 'boulders/create' endpoint", () => {
  describe("When it receives a request with new boulder with name 'Welcome to Tijuana'", () => {
    test("Then it should return a response with status 200 and new boulder 'Welcome to Tijuana", async () => {
      const expectedStatusCode = 201;

      const response = await request(app)
        .post("/boulders/create")
        .set("Authorization", `Bearer ${tokenMock}`)
        .send({ boulderDetails: createboulderMock })
        .expect(expectedStatusCode);

      expect(response.status).toBe(expectedStatusCode);
    });
  });
});
