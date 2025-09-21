import { Router } from "express";
import { indexController } from "../controllers/indexController.js";
export const indexRouter = Router();

indexRouter.get("/", indexController.indexGet);
indexRouter.post("/login", indexController.indexGet);
indexRouter.post("/signup", indexController.indexGet);
