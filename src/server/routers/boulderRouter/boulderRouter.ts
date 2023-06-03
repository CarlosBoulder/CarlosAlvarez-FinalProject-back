import { Router } from "express";
import { getBoulders } from "../../controllers/boulders/bouldersControllers.js";

const boulderRouter = Router();

boulderRouter.get("/all", getBoulders);

export default boulderRouter;
