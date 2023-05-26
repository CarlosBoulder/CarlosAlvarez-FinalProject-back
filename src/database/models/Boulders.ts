import { Schema, model } from "mongoose";

const boulderSchema = new Schema({
  img: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  crag: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
});

const Boulder = model("boulder", boulderSchema, "boulders");

export default Boulder;
