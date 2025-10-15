import { Router } from "express";
import { exploreController } from "../controllers/exploreController.js";
export const exploreRouter = Router();

exploreRouter.get("/", exploreController.exploreGet);
exploreRouter.get("/result", exploreController.resultGet);