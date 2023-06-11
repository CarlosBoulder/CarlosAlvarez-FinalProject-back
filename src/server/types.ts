import { type Request } from "express";
import { type Types } from "mongoose";

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserCredentialsStructure extends UserCredentials {
  _id: string;
}

export type UserCredentialsRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentials
>;

export type UserData = {
  _id: Types.ObjectId;
} & UserCredentials;

export interface MockUserCredentials {
  username: string;
  password: number;
}

export interface AuthRequest extends Request {
  userId: string;
}

export type CustomResponse = Pick<Response, "status" | "json">;

export interface BoulderDetails {
  boulderDetails: BoulderDetailsBody;
}

export type BoulderDetailsRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  BoulderDetails
>;

export interface BoulderDetailsBody {
  img: string;
  name: string;
  crag: string;
  spot: string;
  country: string;
  description: string;
  grade: string;
}
