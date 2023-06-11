import { Router } from "express";
import {
  addBoulder,
  deleteBoulder,
  getBoulders,
  getPaginatedBoulders,
} from "../../controllers/boulders/bouldersControllers.js";

const boulderRouter = Router();

boulderRouter.get("/all", getBoulders);

boulderRouter.get("/paged", getPaginatedBoulders);

boulderRouter.delete("/:boulderId", deleteBoulder);

boulderRouter.post("/create", addBoulder);

export default boulderRouter;
