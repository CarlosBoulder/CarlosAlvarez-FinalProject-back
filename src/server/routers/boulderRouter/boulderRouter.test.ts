import "../../../loadEnvironment.js";
import request from "supertest";
import app from "../../app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToDatabase from "../../../database/connectToDatabase";
import mongoose from "mongoose";
import Boulder from "../../../database/models/Boulders.js";
import { tokenMock } from "../../../mocks/tokenMock.js";
import boulderMock from "../../../mocks/boulderMock.js";

let server: MongoMemoryServer;
const path = "/boulders/all";

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
  await Boulder.create(boulderMock);
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await Boulder.deleteMany();
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

  describe("When it recieve a request with invalid token", () => {
    test("Then it should return statusCode 401 ", async () => {
      const expectedStatus = 401;

      await request(app).get(path).expect(expectedStatus);
    });
  });
});
