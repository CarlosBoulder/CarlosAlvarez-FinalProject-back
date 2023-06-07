import { Router } from "express";
import {
  deleteBoulder,
  getBoulders,
} from "../../controllers/boulders/bouldersControllers.js";

const boulderRouter = Router();

boulderRouter.get("/all", getBoulders);

boulderRouter.delete("/all", deleteBoulder);

export default boulderRouter;
