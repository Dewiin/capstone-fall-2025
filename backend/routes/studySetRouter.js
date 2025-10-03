import { Router } from "express";
import { studySetController } from "../controllers/studySetController.js";
export const studySetRouter = Router();

studySetRouter.get("/:studySetId", studySetController.studySetGet);