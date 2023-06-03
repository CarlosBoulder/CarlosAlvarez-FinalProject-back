import { Types } from "mongoose";
import { type BoulderStructureId } from "./types";

const boulderMock: BoulderStructureId[] = [
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

export default boulderMock;
