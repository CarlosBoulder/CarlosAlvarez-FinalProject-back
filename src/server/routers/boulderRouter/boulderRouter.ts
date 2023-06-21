import { Router } from "express";
import {
  addBoulder,
  deleteBoulder,
  getBoulder,
  getBoulders,
  getPaginatedBoulders,
} from "../../controllers/boulders/bouldersControllers.js";

const boulderRouter = Router();

boulderRouter.get("/paged", getPaginatedBoulders);

boulderRouter.get("/all", getBoulders);

boulderRouter.get("/:id", getBoulder);

boulderRouter.delete("/:boulderId", deleteBoulder);

boulderRouter.post("/create", addBoulder);

export default boulderRouter;
