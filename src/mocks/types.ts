import { type Types } from "mongoose";

export interface BoulderStructure {
  img: string;
  name: string;
  crag: string;
  spot: string;
  country: string;
  description: string;
  grade: string;
}

export interface BoulderStructureId extends BoulderStructure {
  _id: Types.ObjectId;
}
