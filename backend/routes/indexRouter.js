import { Router } from "express";
import { indexController } from "../controllers/indexController.js";
export const indexRouter = Router();

indexRouter.get("/", indexController.indexGet);
