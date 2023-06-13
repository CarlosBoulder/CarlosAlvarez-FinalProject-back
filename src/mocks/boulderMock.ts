import { Types } from "mongoose";
import { type BoulderStructureId } from "./types";
import { type BoulderDetailsBody } from "../server/types";

export const boulderMock: BoulderStructureId[] = [
  {
    _id: new Types.ObjectId("6470ddcd54aeae925d46d8d6"),
    img: "imgUrl",
    name: "Rema remero",
    crag: "Techos",
    spot: "Albarracín",
    country: "España",
    description: "Sit start from small crimps",
    grade: "7A",
  },
];

export const createboulderMock: BoulderDetailsBody = {
  img: "https://i.ibb.co/5BhppTZ/welcome.jpg",
  name: "Welcome to Tijuana",
  crag: "Apremont",
  spot: "Fontainebleau",
  country: "France",
  description: "Overhang, slopers, sitstart",
  grade: "7C",
};
