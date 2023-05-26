import "../../../loadEnvironment.js";
import request from "supertest";
import jwt from "jsonwebtoken";

import connectToDatabase from "../../../database/connectToDatabase";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../../../database/models/User";
import {
  type MockUserCredentials,
  type UserCredentials,
  type UserData,
} from "../../types.js";
import app from "../../app.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

const mockUser: UserCredentials = {
  username: "admin",
  password: "admin",
};

const mockUserHashed: UserCredentials = {
  username: "admin",
  password: "$2y$10$LN2qRiWAC6xlrSXE1FkzxekjkA/j.lG1/n98h4zjHtdPBb4K8z34O",
};

describe("Given a POST 'user/login' endpoint", () => {
  describe("When it receives a request with a username 'admin' and a password 'admin'", () => {
    let newUser: UserData;

    beforeAll(async () => {
      newUser = await User.create(mockUserHashed);
    });

    test("Then it should respond with a response with status 200 and a 'token'", async () => {
      const expectedStatus = 200;

      const response: { body: { token: string } } = await request(app)
        .post("/user/login")
        .send(mockUser)
        .expect(expectedStatus);

      const payload = jwt.verify(response.body.token, process.env.JWT_SECRET!);
      const userId = payload.sub as string;

      expect(userId).toBe(newUser._id.toString());
    });
  });

  describe("When it receives a request with wrong credentials username 'admi' and a wrong password 'admi'", () => {
    test("Then it should respond a status 401 and message 'Wrong Credentials'", async () => {
      const invalidMockUser: UserCredentials = {
        username: "admi",
        password: "admi",
      };

      const expectedStatus = 401;

      const expectedMessage = "Wrong Credentials";

      const response = await request(app)
        .post("/user/login")
        .send(invalidMockUser)
        .expect(expectedStatus);

      expect(response.body.message).toBe(expectedMessage);
    });
  });
  describe("When it receives a request with invalid format credentials username 'admin' and password 4", () => {
    test("Then it should respond with status 400 and message 'Validation Failed'", async () => {
      const invalidFormatUser: MockUserCredentials = {
        username: "admi",
        password: 4,
      };
      const expectedStatus = 400;
      const expectedMessage = "Validation Failed";

      const response = await request(app)
        .post("/user/login")
        .send(invalidFormatUser)
        .expect(expectedStatus);

      expect(response.body.message).toBe(expectedMessage);
    });
  });
});
